const mongoose = require('mongoose');

// ইনিশিয়াল প্লেসহোল্ডার ডেটা (যাতে প্রথমবার লোড হলেও ডিজাইন অক্ষত থাকে)
const defaultData = {
  siteLogo: 'assets/img/logo.png',
  siteFavicon: './assets/img/favicon.ico',
  dashboardAvatar: 'assets/img/profile-pic.png',
  projectCategories: ['website', 'wordpress', 'photoshop', 'illustrator'],

  badgeText: "- I Am Md. Tamal Hossain",
  name: 'Md. Tamal Hossain',
  typingTitles: 'Front-End Developer, WordPress Specialist, UI/UX Designer, Graphic Designer',
  heroTagline: 'Crafting high-performance, modern web interfaces and intuitive digital experiences with a clean, user-centric design approach.',
  btnSayHelloLink: '#contact',
  btnPortfolioLink: '#portfolio',

  aboutBio: 'I am a passionate Front-End Developer and Creative Designer dedicated to building high-performance, accessible, and visually compelling web applications. With expertise spanning modern JavaScript frameworks, custom WordPress architectures, and intuitive UI/UX design, I bridge the gap between creative visual concepts and robust code.\n\nEvery project is approached with precision—focusing on clean code, seamless user journeys, and search-optimized structure.',
  profileImage: 'assets/img/profile-pic.png',
  resumeFile: '#',

  funfacts: [
    { number: '90', label: 'Happy Clients', icon: 'fa-solid fa-users' },
    { number: '110', label: 'Successful Projects', icon: 'fa-solid fa-award' },
    { number: '7', label: 'Web Projects', icon: 'fa-solid fa-laptop-code' },
    { number: '120', label: 'Graphic & UI Projects', icon: 'fa-solid fa-palette' }
  ],

  services: [
    { title: 'Web Design', icon: 'ti-world', desc: 'Designing modern, responsive websites with user-friendly interfaces, clean layouts, and engaging digital experiences.' },
    { title: 'WordPress Development', icon: 'ti-wordpress', desc: 'Building responsive, customizable WordPress websites with clean structure, WooCommerce setup, and seamless UX.' },
    { title: 'Graphic & UI Design', icon: 'ti-write', desc: 'Creating visually compelling graphics and intuitive UI designs that enhance user experience and brand identity.' }
  ],

  technologies: [
    { name: 'Bootstrap', logo: './assets/img/Technologies/bootstrap.png' },
    { name: 'HTML5', logo: './assets/img/Technologies/html.png' },
    { name: 'CSS3', logo: './assets/img/Technologies/css.png' },
    { name: 'JavaScript', logo: './assets/img/Technologies/JavaScript-Logo.png' },
    { name: 'Figma', logo: './assets/img/Technologies/figma.png' },
    { name: 'Adobe XD', logo: './assets/img/Technologies/xd.png' },
    { name: 'Adobe Photoshop', logo: './assets/img/Technologies/photoshop-01.png' },
    { name: 'Adobe Illustrator', logo: './assets/img/Technologies/illustrator.png' },
    { name: 'WordPress', logo: './assets/img/Technologies/wordpress-01.png' },
    { name: 'Elementor', logo: './assets/img/Technologies/elementor.png' }
  ],

  skills: [
    { name: 'Photoshop', percentage: 95 },
    { name: 'WordPress Development', percentage: 90 },
    { name: 'Front-End (HTML / CSS / JS)', percentage: 85 },
    { name: 'UI / UX Design', percentage: 80 },
    { name: 'Adobe Illustrator', percentage: 100 }
  ],

  education: [
    { degree: 'Web Design & Development', institute: 'UY Lab', year: '2025' },
    { degree: 'Diploma in Engineering', institute: 'Bhola Polytechnic Institute', year: '2023' },
    { degree: 'Secondary School Certificate', institute: 'Barishal Technical School & College', year: '2019' }
  ],
  experience: [
    { role: 'IT Consultant', company: 'Elevex Mart International', duration: '2025 - Present', description: 'Managing end-to-end website optimization, adding features, bug fixing, and designing high-impact visual mockups and marketing assets.' },
    { role: 'IT Consultant & Designer', company: 'Sunny Travels and Tour Ltd.', duration: '2024 - 2025', description: 'Created corporate branding, designed promotional brochures, social media marketing content, and executed travel campaigns.' },
    { role: 'Sales Engineer', company: 'Suntech HVAC Engineering Ltd.', duration: '2023 - 2024', description: 'Managed key client relationships, drafted technical HVAC proposals, prepared cost estimations, and negotiated contracts.' }
  ],

  email: 'tamalhossain908@gmail.com',
  phone: '+880 1730 048626',
  address: 'Barishal Sadar, Barishal-8200, Bangladesh',
  socialLinks: [
    { name: 'GitHub', icon: 'fa-brands fa-github', url: 'https://github.com/tamalhossain123' },
    { name: 'LinkedIn', icon: 'fa-brands fa-linkedin-in', url: 'https://www.linkedin.com/in/iamtamal1' },
    { name: 'Upwork', icon: 'fa-brands fa-upwork', url: 'https://www.upwork.com/freelancers/~01a10fab5dc1d5b765' },
    { name: 'Twitter', icon: 'fa-brands fa-x-twitter', url: 'https://x.com/tamalhossain123' },
    { name: 'Facebook', icon: 'fa-brands fa-facebook-f', url: 'https://www.facebook.com/iamtamal1' },
    { name: 'WhatsApp', icon: 'fa-brands fa-whatsapp', url: 'https://wa.me/qr/A4ODBWOWFBRPF1' }
  ]
};

// সম্পূর্ণ আপডেটেড স্কিমা
const profileSchema = new mongoose.Schema({
  // ১. ব্র্যান্ডিং ও ড্যাশবোর্ড
  siteLogo: { type: String, default: defaultData.siteLogo },
  siteFavicon: { type: String, default: defaultData.siteFavicon },
  dashboardAvatar: { type: String, default: defaultData.dashboardAvatar },
  projectCategories: { type: [String], default: defaultData.projectCategories },

  // ২. হিরো সেকশন
  badgeText: { type: String, default: defaultData.badgeText },
  name: { type: String, default: defaultData.name },
  typingTitles: { type: String, default: defaultData.typingTitles },
  heroTagline: { type: String, default: defaultData.heroTagline },
  btnSayHelloLink: { type: String, default: defaultData.btnSayHelloLink },
  btnPortfolioLink: { type: String, default: defaultData.btnPortfolioLink },

  // ৩. অ্যাবাউট ও ফাইল
  aboutBio: { type: String, default: defaultData.aboutBio },
  profileImage: { type: String, default: defaultData.profileImage },
  resumeFile: { type: String, default: defaultData.resumeFile },

  // ৪. ডাইনামিক অ্যারে সমুহ
  funfacts: [{
    number: { type: String },
    label: { type: String },
    icon: { type: String }
  }],

  services: [{
    title: { type: String },
    icon: { type: String },
    desc: { type: String }
  }],

  technologies: [{
    name: { type: String },
    logo: { type: String }
  }],

  skills: [{
    name: { type: String },
    percentage: { type: Number }
  }],

  education: [{
    degree: { type: String },
    institute: { type: String },
    year: { type: String }
  }],

  experience: [{
    role: { type: String },
    company: { type: String },
    duration: { type: String },
    description: { type: String }
  }],

  // ৫. কনট্যাক্ট ও সোশ্যালস
  email: { type: String, default: defaultData.email },
  phone: { type: String, default: defaultData.phone },
  address: { type: String, default: defaultData.address },
  socialLinks: [{
    name: { type: String },
    icon: { type: String },
    url: { type: String }
  }]
}, { timestamps: true });

// মডেল এক্সপোর্ট (OverwriteModelError প্রটেকশন সহ)
module.exports = mongoose.models.Profile || mongoose.model('Profile', profileSchema);