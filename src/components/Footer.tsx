import Link from "next/link";
import { Facebook, Instagram, Twitter, MessageCircle, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0A0A0A] pt-24 pb-12 border-t border-gold/20 text-white">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                <div>
                    <Link href="/" className="flex items-center gap-2 mb-8">
                        <span className="material-symbols-outlined text-primary text-3xl">watch</span>
                        <h2 className="font-nav text-2xl font-bold tracking-widest text-white">CHRONOS</h2>
                    </Link>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8">
                        Defining the art of time since 1994. Our journey is paved with precision, luxury, and the pursuit of horological perfection.
                    </p>
                    <div className="flex gap-4">
                        {[Facebook, Instagram, Twitter].map((Icon, i) => (
                            <Link
                                key={i}
                                href="https://example.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all"
                            >
                                <Icon className="w-5 h-5" />
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-nav font-bold uppercase tracking-widest text-sm mb-8">Quick Links</h4>
                    <ul className="flex flex-col gap-4 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                        <li><Link href="/shop" className="hover:text-primary transition-colors">Men&apos;s Collection</Link></li>
                        <li><Link href="/shop" className="hover:text-primary transition-colors">Women&apos;s Collection</Link></li>
                        <li><Link href="/shop" className="hover:text-primary transition-colors">Limited Editions</Link></li>
                        <li><Link href="/shop" className="hover:text-primary transition-colors">Bespoke Services</Link></li>
                        <li><Link href="/shop" className="hover:text-primary transition-colors">Gift Cards</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-nav font-bold uppercase tracking-widest text-sm mb-8">Concierge</h4>
                    <ul className="flex flex-col gap-4 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                        <li><Link href="/" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
                        <li><Link href="/" className="hover:text-primary transition-colors">Return & Exchange</Link></li>
                        <li><Link href="/" className="hover:text-primary transition-colors">Watch Care Guide</Link></li>
                        <li><Link href="/" className="hover:text-primary transition-colors">Store Locator</Link></li>
                        <li><Link href="/" className="hover:text-primary transition-colors">FAQ</Link></li>
                    </ul>

                </div>

                <div>
                    <h4 className="text-white font-nav font-bold uppercase tracking-widest text-sm mb-8">Contact Us</h4>
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-4">
                            <MapPin className="text-primary w-5 h-5 shrink-0" />
                            <p className="text-slate-500 text-sm">1245 Fifth Avenue, New York, NY 10102</p>
                        </div>
                        <div className="flex gap-4">
                            <Mail className="text-primary w-5 h-5 shrink-0" />
                            <p className="text-slate-500 text-sm">concierge@chronos.com</p>
                        </div>
                        <Link
                            href="https://wa.me/91XXXXXXXXXX"
                            className="bg-[#25D366] text-white flex items-center justify-center gap-3 py-3 rounded-none font-nav font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
                        >
                            <MessageCircle className="w-5 h-5" />
                            WhatsApp Support
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-slate-600 text-xs uppercase tracking-widest">© 2024 CHRONOS Watches. All Rights Reserved.</p>
                <div className="flex gap-8 text-slate-600 text-xs uppercase tracking-widest">
                    <Link href="/" className="hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link href="/" className="hover:text-primary transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
