interface DeckStatusProps {
  curCard: number;
  cardCount: number;
  correctCount: number;
}

export const DeckStatus = ({ curCard, cardCount, correctCount }: DeckStatusProps) => {
    return (
        <div className="deck-status">
            {curCard} / {cardCount} (<span style={{ color: "green" }}>{correctCount}</span>)
        </div>
    );
};
