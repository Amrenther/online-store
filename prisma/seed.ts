import 'dotenv/config';
import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

/** Catalog seed values are legacy USD figures; stored `price` is paise (INR × 100). */
const USD_TO_INR = 83;

async function main() {
    console.log("Clearing all data…");
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    await prisma.healthCheck.deleteMany();
    console.log("Clear complete.");

    await prisma.healthCheck.create({
        data: {
            message: "Hello, Prisma Database!",
        },
    });
    console.log("Health check record created.");


    const categories = [
        {name: 'Electronics', slug: 'electronics'},
        {name: 'Books', slug: 'books'},
        {name: 'Clothing', slug: 'clothing'},
        {name: 'Furniture', slug: 'furniture'},
        {name: 'Other', slug: 'other'},
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: { name: category.name },
            create: { name: category.name, slug: category.slug },
        });
        console.log(`Category ${category.name} created successfully!`);
    }

    const electronics = await prisma.category.findFirst({ where: { slug: 'electronics' } });
    const books = await prisma.category.findFirst({ where: { slug: 'books' } });
    const clothing = await prisma.category.findFirst({ where: { slug: 'clothing' } });
    const furniture = await prisma.category.findFirst({ where: { slug: 'furniture' } });
    const other = await prisma.category.findFirst({ where: { slug: 'other' } });

    const products = [
        // Electronics (30)
        { name: 'Laptop', slug: 'laptop', description: 'High-performance portable computer with a 15-inch display and 16GB RAM.', price: 1200, image: 'https://picsum.photos/seed/laptop/400/300', categoryId: electronics?.id },
        { name: 'Smartphone', slug: 'smartphone', description: 'Flagship smartphone with OLED display, triple camera system, and 5G connectivity.', price: 899, image: 'https://picsum.photos/seed/smartphone/400/300', categoryId: electronics?.id },
        { name: 'Tablet', slug: 'tablet', description: 'Lightweight 11-inch tablet perfect for drawing, reading, and browsing.', price: 450, image: 'https://picsum.photos/seed/tablet/400/300', categoryId: electronics?.id },
        { name: 'Smartwatch', slug: 'smartwatch', description: 'Fitness-focused smartwatch with heart rate monitor and GPS tracking.', price: 249, image: 'https://picsum.photos/seed/smartwatch/400/300', categoryId: electronics?.id },
        { name: 'Smart TV', slug: 'smart-tv', description: '55-inch 4K UHD Smart TV with built-in streaming apps and voice control.', price: 699, image: 'https://picsum.photos/seed/smarttv/400/300', categoryId: electronics?.id },
        { name: 'Wireless Earbuds', slug: 'wireless-earbuds', description: 'Noise-cancelling wireless earbuds with 24-hour battery life.', price: 149, image: 'https://picsum.photos/seed/earbuds/400/300', categoryId: electronics?.id },
        { name: 'Gaming Console', slug: 'gaming-console', description: 'Next-gen gaming console with 1TB SSD and 4K gaming support.', price: 499, image: 'https://picsum.photos/seed/console/400/300', categoryId: electronics?.id },
        { name: 'Bluetooth Speaker', slug: 'bluetooth-speaker', description: 'Portable waterproof Bluetooth speaker with 360-degree sound.', price: 79, image: 'https://picsum.photos/seed/speaker/400/300', categoryId: electronics?.id },
        { name: 'Mechanical Keyboard', slug: 'mechanical-keyboard', description: 'RGB mechanical keyboard with Cherry MX switches and aluminum frame.', price: 129, image: 'https://picsum.photos/seed/keyboard/400/300', categoryId: electronics?.id },
        { name: 'Webcam 4K', slug: 'webcam-4k', description: 'Ultra HD 4K webcam with auto-focus and built-in microphone for streaming.', price: 99, image: 'https://picsum.photos/seed/webcam/400/300', categoryId: electronics?.id },
        { name: 'External SSD', slug: 'external-ssd', description: '1TB portable SSD with USB 3.2 Gen 2 for fast file transfers.', price: 120, image: 'https://picsum.photos/seed/externalssd/400/300', categoryId: electronics?.id },
        { name: 'Wireless Mouse', slug: 'wireless-mouse', description: 'Ergonomic wireless mouse with precise optical sensor and 18-month battery.', price: 45, image: 'https://picsum.photos/seed/wirelessmouse/400/300', categoryId: electronics?.id },
        { name: 'Monitor 27 inch', slug: 'monitor-27', description: '27-inch QHD IPS monitor with 165Hz refresh rate and HDR support.', price: 350, image: 'https://picsum.photos/seed/monitor27/400/300', categoryId: electronics?.id },
        { name: 'USB-C Hub', slug: 'usb-c-hub', description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader.', price: 55, image: 'https://picsum.photos/seed/usbchub/400/300', categoryId: electronics?.id },
        { name: 'Headphones Over-Ear', slug: 'headphones-over-ear', description: 'Studio-grade over-ear headphones with 40mm drivers and foldable design.', price: 180, image: 'https://picsum.photos/seed/headphones/400/300', categoryId: electronics?.id },
        { name: 'Fitness Tracker', slug: 'fitness-tracker', description: 'Slim fitness band with heart rate, sleep tracking, and 7-day battery.', price: 45, image: 'https://picsum.photos/seed/fitnesstracker/400/300', categoryId: electronics?.id },
        { name: 'Ring Light', slug: 'ring-light', description: '10-inch LED ring light with adjustable brightness and tri-fold stand.', price: 35, image: 'https://picsum.photos/seed/ringlight/400/300', categoryId: electronics?.id },
        { name: 'Graphics Tablet', slug: 'graphics-tablet', description: 'Pressure-sensitive drawing tablet with 8192 levels for artists.', price: 110, image: 'https://picsum.photos/seed/graphicstablet/400/300', categoryId: electronics?.id },
        { name: 'NAS Drive', slug: 'nas-drive', description: '2-bay NAS with 8TB total storage for home backup and media streaming.', price: 320, image: 'https://picsum.photos/seed/nasdrive/400/300', categoryId: electronics?.id },
        { name: 'Action Camera', slug: 'action-camera', description: '4K waterproof action camera with image stabilization for adventure.', price: 199, image: 'https://picsum.photos/seed/actioncamera/400/300', categoryId: electronics?.id },
        { name: 'Smart Plug', slug: 'smart-plug', description: 'WiFi smart plug with voice control and energy monitoring.', price: 18, image: 'https://picsum.photos/seed/smartplug/400/300', categoryId: electronics?.id },
        { name: 'Streaming Microphone', slug: 'streaming-microphone', description: 'Cardioid condenser mic with USB connection for podcasting and streaming.', price: 75, image: 'https://picsum.photos/seed/streamingmic/400/300', categoryId: electronics?.id },
        { name: 'VR Headset', slug: 'vr-headset', description: 'Standalone VR headset with 128GB storage and hand tracking.', price: 399, image: 'https://picsum.photos/seed/vrheadset/400/300', categoryId: electronics?.id },
        { name: 'E-Reader', slug: 'e-reader', description: '7-inch e-ink reader with backlight and weeks of battery life.', price: 130, image: 'https://picsum.photos/seed/ereader/400/300', categoryId: electronics?.id },
        { name: 'Gaming Mouse', slug: 'gaming-mouse', description: 'RGB gaming mouse with 16000 DPI sensor and programmable buttons.', price: 65, image: 'https://picsum.photos/seed/gamingmouse/400/300', categoryId: electronics?.id },
        { name: 'Laptop Stand', slug: 'laptop-stand', description: 'Aluminum laptop stand with adjustable angles for ergonomic use.', price: 40, image: 'https://picsum.photos/seed/laptopstand/400/300', categoryId: electronics?.id },
        { name: 'Smart Doorbell', slug: 'smart-doorbell', description: '1080p video doorbell with two-way audio and motion alerts.', price: 150, image: 'https://picsum.photos/seed/smartdoorbell/400/300', categoryId: electronics?.id },
        { name: 'Dash Cam', slug: 'dash-cam', description: 'Dual-channel dash cam with 4K front and 1080p rear cameras.', price: 130, image: 'https://picsum.photos/seed/dashcam/400/300', categoryId: electronics?.id },
        { name: 'Noise Cancelling Headphones', slug: 'noise-cancelling-headphones', description: 'Premium ANC headphones with 30-hour battery and transparency mode.', price: 280, image: 'https://picsum.photos/seed/ancphones/400/300', categoryId: electronics?.id },
        { name: 'Chromecast', slug: 'chromecast', description: 'Stream 4K content from your phone or laptop to any TV.', price: 50, image: 'https://picsum.photos/seed/chromecast/400/300', categoryId: electronics?.id },
        { name: 'Robot Vacuum', slug: 'robot-vacuum', description: 'Smart robot vacuum with laser mapping and app control.', price: 350, image: 'https://picsum.photos/seed/robotvacuum/400/300', categoryId: electronics?.id },
        { name: 'Portable SSD', slug: 'portable-ssd', description: '500GB rugged portable SSD with water and shock resistance.', price: 65, image: 'https://picsum.photos/seed/portablessd/400/300', categoryId: electronics?.id },
        { name: 'Smart Thermostat', slug: 'smart-thermostat', description: 'WiFi smart thermostat with learning algorithm and app control.', price: 120, image: 'https://picsum.photos/seed/smartthermostat/400/300', categoryId: electronics?.id },
        { name: 'Digital Camera', slug: 'digital-camera', description: 'Compact 20MP digital camera with 5x optical zoom and 4K video.', price: 299, image: 'https://picsum.photos/seed/digitalcamera/400/300', categoryId: electronics?.id },
        { name: 'Power Strip', slug: 'power-strip', description: '6-outlet surge protector with USB-C and USB-A charging ports.', price: 35, image: 'https://picsum.photos/seed/powerstrip/400/300', categoryId: electronics?.id },
        { name: 'Blue Light Glasses', slug: 'blue-light-glasses', description: 'Anti-blue light glasses for reduced eye strain during screen time.', price: 25, image: 'https://picsum.photos/seed/bluelightglasses/400/300', categoryId: electronics?.id },

        // Books (10)
        { name: 'JavaScript: The Good Parts', slug: 'javascript-good-parts', description: 'A deep dive into the best features of JavaScript by Douglas Crockford.', price: 30, image: 'https://picsum.photos/seed/jsbook/400/300', categoryId: books?.id },
        { name: 'Clean Code', slug: 'clean-code', description: 'A handbook of agile software craftsmanship by Robert C. Martin.', price: 35, image: 'https://picsum.photos/seed/cleancode/400/300', categoryId: books?.id },
        { name: 'The Pragmatic Programmer', slug: 'pragmatic-programmer', description: 'Classic guide covering tips and techniques for modern software development.', price: 42, image: 'https://picsum.photos/seed/pragmatic/400/300', categoryId: books?.id },
        { name: 'Design Patterns', slug: 'design-patterns', description: 'Elements of reusable object-oriented software by the Gang of Four.', price: 45, image: 'https://picsum.photos/seed/designpat/400/300', categoryId: books?.id },
        { name: 'Atomic Habits', slug: 'atomic-habits', description: 'Practical strategies for building good habits and breaking bad ones.', price: 18, image: 'https://picsum.photos/seed/atomichabits/400/300', categoryId: books?.id },
        { name: 'Dune', slug: 'dune', description: 'Epic science fiction novel set in a distant future on the desert planet Arrakis.', price: 15, image: 'https://picsum.photos/seed/dune/400/300', categoryId: books?.id },
        { name: 'The Great Gatsby', slug: 'the-great-gatsby', description: 'F. Scott Fitzgerald\'s classic tale of wealth and ambition in the Jazz Age.', price: 12, image: 'https://picsum.photos/seed/gatsby/400/300', categoryId: books?.id },
        { name: 'Sapiens', slug: 'sapiens', description: 'A brief history of humankind exploring how Homo sapiens came to dominate Earth.', price: 20, image: 'https://picsum.photos/seed/sapiens/400/300', categoryId: books?.id },
        { name: 'Thinking, Fast and Slow', slug: 'thinking-fast-slow', description: 'Daniel Kahneman explores the two systems that drive how we think.', price: 22, image: 'https://picsum.photos/seed/thinking/400/300', categoryId: books?.id },
        { name: 'The Alchemist', slug: 'the-alchemist', description: 'Paulo Coelho\'s magical story about following your dreams and personal legend.', price: 14, image: 'https://picsum.photos/seed/alchemist/400/300', categoryId: books?.id },

        // Clothing (10)
        { name: 'Classic White T-Shirt', slug: 'classic-white-tshirt', description: '100% organic cotton crew-neck t-shirt in crisp white.', price: 25, image: 'https://picsum.photos/seed/whitetee/400/300', categoryId: clothing?.id },
        { name: 'Slim Fit Jeans', slug: 'slim-fit-jeans', description: 'Stretch denim slim-fit jeans with a modern tapered leg.', price: 65, image: 'https://picsum.photos/seed/jeans/400/300', categoryId: clothing?.id },
        { name: 'Leather Jacket', slug: 'leather-jacket', description: 'Genuine leather biker jacket with zippered pockets and quilted lining.', price: 250, image: 'https://picsum.photos/seed/leatherjacket/400/300', categoryId: clothing?.id },
        { name: 'Running Shoes', slug: 'running-shoes', description: 'Lightweight running shoes with responsive cushioning and breathable mesh.', price: 120, image: 'https://picsum.photos/seed/runshoes/400/300', categoryId: clothing?.id },
        { name: 'Wool Beanie', slug: 'wool-beanie', description: 'Soft merino wool beanie hat available in multiple colors.', price: 20, image: 'https://picsum.photos/seed/beanie/400/300', categoryId: clothing?.id },
        { name: 'Hoodie', slug: 'hoodie', description: 'Heavyweight cotton-blend hoodie with kangaroo pocket and adjustable drawstring.', price: 55, image: 'https://picsum.photos/seed/hoodie/400/300', categoryId: clothing?.id },
        { name: 'Formal Dress Shirt', slug: 'formal-dress-shirt', description: 'Wrinkle-resistant slim-fit dress shirt in classic blue.', price: 60, image: 'https://picsum.photos/seed/dressshirt/400/300', categoryId: clothing?.id },
        { name: 'Cargo Shorts', slug: 'cargo-shorts', description: 'Relaxed-fit cargo shorts with multiple utility pockets.', price: 40, image: 'https://picsum.photos/seed/cargoshorts/400/300', categoryId: clothing?.id },
        { name: 'Winter Parka', slug: 'winter-parka', description: 'Insulated waterproof parka with faux-fur hood trim for extreme cold.', price: 200, image: 'https://picsum.photos/seed/parka/400/300', categoryId: clothing?.id },
        { name: 'Sneakers', slug: 'sneakers', description: 'Casual low-top sneakers with a clean minimalist design.', price: 85, image: 'https://picsum.photos/seed/sneakers/400/300', categoryId: clothing?.id },

        // Furniture (10)
        { name: 'Standing Desk', slug: 'standing-desk', description: 'Electric height-adjustable standing desk with memory presets.', price: 499, image: 'https://picsum.photos/seed/standingdesk/400/300', categoryId: furniture?.id },
        { name: 'Ergonomic Office Chair', slug: 'ergonomic-office-chair', description: 'Mesh-back ergonomic chair with lumbar support and adjustable armrests.', price: 350, image: 'https://picsum.photos/seed/officechair/400/300', categoryId: furniture?.id },
        { name: 'Bookshelf', slug: 'bookshelf', description: '5-tier solid wood bookshelf with a walnut finish.', price: 180, image: 'https://picsum.photos/seed/bookshelf/400/300', categoryId: furniture?.id },
        { name: 'Coffee Table', slug: 'coffee-table', description: 'Mid-century modern coffee table with tapered legs and storage shelf.', price: 220, image: 'https://picsum.photos/seed/coffeetable/400/300', categoryId: furniture?.id },
        { name: 'Sofa', slug: 'sofa', description: '3-seater linen sofa with deep cushions and solid oak frame.', price: 899, image: 'https://picsum.photos/seed/sofa/400/300', categoryId: furniture?.id },
        { name: 'Dining Table', slug: 'dining-table', description: 'Solid oak dining table seating 6, with a natural grain finish.', price: 650, image: 'https://picsum.photos/seed/diningtable/400/300', categoryId: furniture?.id },
        { name: 'Bedside Table', slug: 'bedside-table', description: 'Compact nightstand with two drawers and a shelf.', price: 95, image: 'https://picsum.photos/seed/nightstand/400/300', categoryId: furniture?.id },
        { name: 'TV Stand', slug: 'tv-stand', description: 'Modern TV console with cable management and tempered glass doors.', price: 275, image: 'https://picsum.photos/seed/tvstand/400/300', categoryId: furniture?.id },
        { name: 'Wardrobe', slug: 'wardrobe', description: 'Spacious 3-door wardrobe with mirror and interior shelving.', price: 520, image: 'https://picsum.photos/seed/wardrobe/400/300', categoryId: furniture?.id },
        { name: 'Recliner Chair', slug: 'recliner-chair', description: 'Faux-leather power recliner with USB charging port.', price: 400, image: 'https://picsum.photos/seed/recliner/400/300', categoryId: furniture?.id },

        // Other (10)
        { name: 'Yoga Mat', slug: 'yoga-mat', description: 'Non-slip 6mm thick yoga mat with alignment markers.', price: 35, image: 'https://picsum.photos/seed/yogamat/400/300', categoryId: other?.id },
        { name: 'Stainless Steel Water Bottle', slug: 'water-bottle', description: 'Double-wall insulated 750ml water bottle that keeps drinks cold 24 hours.', price: 28, image: 'https://picsum.photos/seed/waterbottle/400/300', categoryId: other?.id },
        { name: 'Backpack', slug: 'backpack', description: 'Durable 30L backpack with padded laptop compartment and rain cover.', price: 75, image: 'https://picsum.photos/seed/backpack/400/300', categoryId: other?.id },
        { name: 'Sunglasses', slug: 'sunglasses', description: 'Polarized UV400 sunglasses with lightweight titanium frames.', price: 60, image: 'https://picsum.photos/seed/sunglasses/400/300', categoryId: other?.id },
        { name: 'Travel Mug', slug: 'travel-mug', description: 'Leak-proof ceramic-lined travel mug with one-hand flip lid.', price: 22, image: 'https://picsum.photos/seed/travelmug/400/300', categoryId: other?.id },
        { name: 'Desk Lamp', slug: 'desk-lamp', description: 'LED desk lamp with adjustable color temperature and brightness levels.', price: 45, image: 'https://picsum.photos/seed/desklamp/400/300', categoryId: other?.id },
        { name: 'Wall Clock', slug: 'wall-clock', description: 'Silent non-ticking 12-inch wall clock with a minimalist design.', price: 30, image: 'https://picsum.photos/seed/wallclock/400/300', categoryId: other?.id },
        { name: 'Scented Candle Set', slug: 'scented-candle-set', description: 'Set of 3 soy wax candles in lavender, vanilla, and cedarwood.', price: 32, image: 'https://picsum.photos/seed/candles/400/300', categoryId: other?.id },
        { name: 'Wireless Charger', slug: 'wireless-charger', description: '15W fast wireless charging pad compatible with all Qi-enabled devices.', price: 25, image: 'https://picsum.photos/seed/wirelesscharger/400/300', categoryId: other?.id },
        { name: 'Portable Power Bank', slug: 'portable-power-bank', description: '20000mAh power bank with dual USB-C ports and fast charging.', price: 40, image: 'https://picsum.photos/seed/powerbank/400/300', categoryId: other?.id },
    ];

    for (const product of products) {
        if (!product.categoryId) continue;
        const pricePaise = Math.round(product.price * USD_TO_INR) * 100;
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {
                name: product.name,
                description: product.description,
                price: pricePaise,
                image: product.image,
                categoryId: product.categoryId,
            },
            create: {
                name: product.name,
                slug: product.slug,
                description: product.description,
                price: pricePaise,
                image: product.image,
                categoryId: product.categoryId,
            },
        });
    }
    console.log(`Seeded ${products.length} products successfully!`);
    
}

main().catch((e) => {
    console.error(e);
}).finally(async () => {
    await prisma.$disconnect();
});