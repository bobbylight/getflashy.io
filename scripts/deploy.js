/*
 * Builds the app and deploys it to S3.
 *
 * Steps:
 * 1. Clean build directory
 * 2. Run linter
 * 3. Build the app
 * 4. Upload build/ contents to S3
 *
 * Usage: Run via npm:
 *   npm run deploy
 */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const buildDir = path.join(rootDir, 'build');

// Configuration from environment variables
const BUCKET_NAME = process.env.FLASHY_S3_BUCKET;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

if (!BUCKET_NAME) {
    console.error('Error: FLASHY_S3_BUCKET environment variable is required');
    process.exit(1);
}

const s3 = new S3Client({ region: AWS_REGION });

function run(command, description) {
    console.log(`\n${description}...`);
    console.log(`> ${command}\n`);
    execSync(command, { cwd: rootDir, stdio: 'inherit' });
}

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const types = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject',
    };
    return types[ext] || 'application/octet-stream';
}

function getAllFiles(dir, baseDir = dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...getAllFiles(fullPath, baseDir));
        } else {
            files.push({
                localPath: fullPath,
                key: path.relative(baseDir, fullPath)
            });
        }
    }

    return files;
}

async function uploadToS3(localPath, key) {
    const body = fs.readFileSync(localPath);
    const contentType = getContentType(localPath);

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: body,
        ContentType: contentType
    });

    await s3.send(command);
    console.log(`Uploaded: ${key}`);
}

async function main() {
    // Step 1: Clean build directory
    console.log('Cleaning build directory...');
    if (fs.existsSync(buildDir)) {
        fs.rmSync(buildDir, { recursive: true });
        console.log('Removed build/');
    }

    // Step 2: Run linter
    run('npm run lint', 'Running linter');

    // Step 3: Build the app
    run('npm run build', 'Building app');

    // Step 4: Upload to S3
    console.log('\nUploading to S3...');
    const files = getAllFiles(buildDir);
    console.log(`Found ${files.length} files to upload\n`);

    for (const file of files) {
        await uploadToS3(file.localPath, file.key);
    }

    console.log(`\nDone! Deployed to s3://${BUCKET_NAME}/`);
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
