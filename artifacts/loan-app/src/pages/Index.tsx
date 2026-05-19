import govLogo from "@/assets/gov-pakistan-logo.png";
import pmShehbaz from "@/assets/pm-shehbaz.png";
import maryam from "@/assets/maryam-nawaz.png";
import LoanForm from "@/components/LoanForm";
import { ShieldCheck, Banknote, Clock, Users, Phone, Mail, MapPin } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="bg-gov-green-dark text-white text-xs py-2">
        <div className="container flex justify-between items-center flex-wrap gap-2">
          <span>اسلامی جمہوریہ پاکستان • Islamic Republic of Pakistan</span>
          <div className="flex flex-col sm:items-end gap-1">
            <span className="opacity-80">Helpline: 0800-12345 (Toll Free)</span>
            <a href="https://wa.me/923410779487" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#25D366] hover:underline font-semibold">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
              </svg>
              WhatsApp: 0341-0779487
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b-4 border-gov-gold shadow-soft sticky top-0 z-40">
        <div className="container py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={govLogo} alt="Government of Pakistan official emblem" className="w-14 h-14 object-contain" width={56} height={56} />
            <div>
              <h1 className="font-display font-bold text-gov-green text-lg sm:text-xl leading-tight">Government of Pakistan</h1>
              <p className="text-[11px] sm:text-xs text-muted-foreground">Ministry of Finance – Loan Assistance Programme</p>
            </div>
          </div>
          <a href="#apply" className="hidden sm:inline-flex bg-gov-green text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gov-green-dark transition shadow-soft">
            Apply Now
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
        <div className="container py-16 sm:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gov-gold/20 border border-gov-gold/40 text-gov-gold px-4 py-1.5 rounded-full text-xs font-semibold mb-5">
                <ShieldCheck className="w-3.5 h-3.5" /> Official Government Initiative 2026
              </div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
                Apna Karobar,<br />Apna Mustaqbil
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-xl">
                Government of Pakistan ke aasan qist program ke zariye PKR 10 Lakh se 3 Crore tak ka qarz hasil karein – kam markup, tez approval.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#apply" className="bg-gradient-gold text-gov-green-dark font-bold px-8 py-3.5 rounded-lg shadow-gold hover:scale-105 transition">
                  Apply for Loan
                </a>
                <a href="#about" className="border-2 border-white/40 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition">
                  Learn More
                </a>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                <div><p className="text-2xl font-bold text-gov-gold">3 Cr</p><p className="text-xs opacity-80">Max Loan</p></div>
                <div><p className="text-2xl font-bold text-gov-gold">48hrs</p><p className="text-xs opacity-80">Approval</p></div>
                <div><p className="text-2xl font-bold text-gov-gold">5 Lac+</p><p className="text-xs opacity-80">Beneficiaries</p></div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gov-gold/20 blur-3xl rounded-full" />
              <img src={govLogo} alt="State emblem of Pakistan" className="relative w-full max-w-md mx-auto drop-shadow-2xl" width={500} height={500} loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="about" className="py-16 sm:py-20 bg-gov-cream">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-gov-gold font-semibold text-sm uppercase tracking-wider mb-2">Leadership Message</p>
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-gov-green">A Vision for Prosperous Pakistan</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl overflow-hidden shadow-elegant border border-gov-green/10">
              <div className="aspect-[4/3] overflow-hidden bg-gov-green-dark">
                <img src={pmShehbaz} alt="Prime Minister Muhammad Shehbaz Sharif" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-6">
                <p className="text-xs text-gov-gold font-bold uppercase tracking-wider">Prime Minister of Pakistan</p>
                <h4 className="font-display text-xl font-bold text-gov-green mt-1">Muhammad Shehbaz Sharif</h4>
                <p className="text-sm text-muted-foreground mt-3 italic">
                  "Har Pakistani ko maaliyati azadi aur khud-mukhtari milni chahiye. Yeh program hamare awam ke liye umeed ki kiran hai."
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-elegant border border-gov-green/10">
              <div className="aspect-[4/3] overflow-hidden bg-gov-green-dark">
                <img src={maryam} alt="Chief Minister Punjab Maryam Nawaz Sharif" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-6">
                <p className="text-xs text-gov-gold font-bold uppercase tracking-wider">Chief Minister Punjab</p>
                <h4 className="font-display text-xl font-bold text-gov-green mt-1">Maryam Nawaz Sharif</h4>
                <p className="text-sm text-muted-foreground mt-3 italic">
                  "Khawateen, naujawan aur chote karobari hazraat ki maali madad hamari hukoomat ki sab se badi tarjeeh hai."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-gov-gold font-semibold text-sm uppercase tracking-wider mb-2">Why Choose Us</p>
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-gov-green">Program Benefits</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Banknote, title: "10 Lakh – 3 Crore", desc: "Aap ki zaroorat ke mutabiq qarz" },
              { icon: Clock, title: "48 Hours Approval", desc: "Tez tareen processing" },
              { icon: ShieldCheck, title: "100% Secure", desc: "Government certified portal" },
              { icon: Users, title: "Sab ke liye", desc: "Karobari, mulazim aur kissan" },
            ].map((f) => (
              <div key={f.title} className="text-center p-6 rounded-xl border border-border hover:border-gov-green hover:shadow-soft transition">
                <div className="w-14 h-14 bg-gov-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-7 h-7 text-gov-green" />
                </div>
                <h4 className="font-bold text-gov-green mb-1">{f.title}</h4>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-16 sm:py-20 bg-gov-cream">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-gov-gold font-semibold text-sm uppercase tracking-wider mb-2">Apply Online</p>
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-gov-green">Loan Application Form</h3>
            <p className="text-muted-foreground mt-3">3 aasan steps mein apni darkhwast jama karwayein</p>
          </div>
          <LoanForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gov-green-dark text-white pt-12 pb-6">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={govLogo} alt="" className="w-12 h-12" width={48} height={48} loading="lazy" />
                <div>
                  <p className="font-display font-bold">Government of Pakistan</p>
                  <p className="text-xs opacity-70">Ministry of Finance</p>
                </div>
              </div>
              <p className="text-sm opacity-80">Official portal for loan assistance programme. All applications are processed through verified government channels.</p>
            </div>
            <div>
              <h5 className="font-bold mb-3 text-gov-gold">Contact</h5>
              <ul className="space-y-2 text-sm opacity-90">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> 0800-12345 (Toll Free)</li>
                <li>
                  <a href="https://wa.me/923410779487" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#25D366] hover:underline font-semibold">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
                    </svg>
                    WhatsApp: 0341-0779487
                  </a>
                </li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@finance.gov.pk</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Q-Block, Pak Secretariat, Islamabad</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-3 text-gov-gold">Quick Links</h5>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#about" className="hover:text-gov-gold">About Programme</a></li>
                <li><a href="#apply" className="hover:text-gov-gold">Apply for Loan</a></li>
                <li><a href="#" className="hover:text-gov-gold">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-gov-gold">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-xs opacity-70">
            © 2026 Government of Pakistan. All rights reserved. | Pakistan Zindabad
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
