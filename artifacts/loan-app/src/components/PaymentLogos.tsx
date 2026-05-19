const PaymentLogos = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-white border border-border rounded-md px-3 py-2 shadow-sm">
        <span className="font-display italic font-bold text-[#1A1F71] text-xl tracking-tight">VISA</span>
      </div>
      <div className="bg-white border border-border rounded-md px-3 py-2 shadow-sm flex items-center">
        <div className="relative flex">
          <div className="w-6 h-6 rounded-full bg-[#EB001B]" />
          <div className="w-6 h-6 rounded-full bg-[#F79E1B] -ml-3 mix-blend-multiply" />
        </div>
        <span className="ml-2 text-xs font-bold text-slate-700">Mastercard</span>
      </div>
    </div>
  );
};

export default PaymentLogos;
