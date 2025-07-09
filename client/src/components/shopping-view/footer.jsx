import logo from "@/assets/logo.jpg";

function Footer() {
  return (
    <footer className="w-full py-10 mt-10 text-gray-300 bg-gray-900 border-t">
      <div className="container grid grid-cols-1 gap-8 px-4 mx-auto md:grid-cols-4">
        {/* Logo Section */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src={logo}
            alt="Glamora Logo"
            className="w-20 h-20 mb-2 rounded-full object-cover border-2 border-white"
          />
          <span className="text-xl font-bold mt-2">Glamora</span>
        </div>
        {/* Contact Us Section */}
        <div>
          <h3 className="mb-3 text-lg font-bold">Contact Us</h3>
          <p className="mb-1">Jagriti Path</p>
          <p className="mb-1">Tilotamma,Rupandehi</p>
          <p className="mb-1">Phone: +977 9847048096</p>
          <p className="mb-1">Email: contact@glamora.com</p>
        </div>
        {/* Quick Links Section */}
        <div>
          <h3 className="mb-3 text-lg font-bold">Quick Links</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <a href="/shop/home" className="hover:underline hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a
                href="/shop/listing"
                className="hover:underline hover:text-white"
              >
                Products
              </a>
            </li>
            <li>
              <a
                href="/shop/account"
                className="hover:underline hover:text-white"
              >
                Account
              </a>
            </li>
          </ul>
        </div>
        {/* Social Media Section */}
        <div>
          <h3 className="mb-3 text-lg font-bold">Follow Us</h3>
          <div className="flex flex-col gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:underline hover:text-white"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg"
                alt="Facebook"
                className="w-5 h-5"
                style={{ filter: "invert(80%)" }}
              />
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:underline hover:text-white"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg"
                alt="Instagram"
                className="w-5 h-5"
                style={{ filter: "invert(80%)" }}
              />
              Instagram
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:underline hover:text-white"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/twitter.svg"
                alt="Twitter"
                className="w-5 h-5"
                style={{ filter: "invert(80%)" }}
              />
              Twitter
            </a>
          </div>
        </div>
      </div>
      <div className="container px-4 mx-auto mt-8 text-sm text-center text-gray-500">
        &copy; {new Date().getFullYear()} Glamora. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
