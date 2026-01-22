const Footer = () => {
    return (
        <footer className="py-16 px-4 border-t border-gray-100 bg-background text-foreground">
            <div className="container-cinematic max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">

                    {/* Logo / Brand */}
                    <div className="text-center md:text-left">
                        <h3 className="font-serif text-2xl font-bold tracking-tighter mb-2">SkillSwap</h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Est. 2026</p>
                    </div>

                    {/* Links */}
                    <div className="flex gap-8 text-sm tracking-wide">
                        <a href="#" className="hover:text-black/60 transition-colors uppercase">Privacy</a>
                        <a href="#" className="hover:text-black/60 transition-colors uppercase">Terms</a>
                        <a href="#contact" className="hover:text-black/60 transition-colors uppercase">Contact</a>
                    </div>

                    {/* Copyright */}
                    <div className="text-sm text-muted-foreground font-light">
                        &copy; 2026. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
