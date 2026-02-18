import { Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground px-6 py-14 md:px-12 lg:px-24">
      <div className="container-narrow">
        <div className="grid gap-10 md:grid-cols-4 mb-12">
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#about" className="hover:opacity-100 transition-opacity">About</a></li>
              <li><a href="#contact" className="hover:opacity-100 transition-opacity">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#services" className="hover:opacity-100 transition-opacity">Software Development</a></li>
              <li><a href="#services" className="hover:opacity-100 transition-opacity">Platform Engineering</a></li>
              <li><a href="#services" className="hover:opacity-100 transition-opacity">LMS Solutions</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Connect</h3>
            <ul className="space-y-2 text-sm opacity-70">
              <li>
                <a href="#" className="inline-flex items-center gap-2 hover:opacity-100 transition-opacity">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              </li>
              <li>
                <a href="mailto:hello@company.com" className="inline-flex items-center gap-2 hover:opacity-100 transition-opacity">
                  <Mail className="w-4 h-4" /> hello@company.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 pt-6 text-sm opacity-50">
          © {new Date().getFullYear()} Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
