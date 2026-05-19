import cardReference from "@/assets/atm-card-reference.png";

interface Props {
  cardNumber?: string;
  cardName?: string;
  expiry?: string;
  cvv?: string;
  flipped?: boolean;
}

const CardIllustration = (_: Props) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <img
        src={cardReference}
        alt="ATM Card Reference / اے ٹی ایم کارڈ"
        className="w-full h-auto rounded-2xl shadow-elegant select-none"
        draggable={false}
      />
    </div>
  );
};

export default CardIllustration;
