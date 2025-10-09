import mongoose from 'mongoose';
import User from './users/models/User.js';
import Card from './cards/models/Card.js';
import { generatePassword } from './users/helpers/bcrypt.js';
import dotenv from 'dotenv';
dotenv.config();

const initialUsers = [
    {
        name: { first: "Regular", middle: "abc", last: "User" },
        email: "regular@example.com",
        password: "password123",
        phone: "0501234567",
        image: {
            url: "http://example.com/img.jpg",
            alt: "profile picture"
        },
        address: {
            state: "IL",
            country: "Israel",
            city: "Arad",
            street: "Shoham",
            houseNumber: 5,
            zip: 8920435
        },
        isAdmin: false,
        isBusiness: false
    },
    {
        name: { first: "Business", middle: "abc", last: "User" },
        email: "business@example.com",
        password: "password123",
        phone: "0501234568",
        image: {
            url: "http://example.com/img.jpg",
            alt: "profile picture"
        },
        address: {
            state: "IL",
            country: "Israel",
            city: "Arad",
            street: "Shoham",
            houseNumber: 5,
            zip: 8920435
        },
        isAdmin: false,
        isBusiness: true
    },
    {
        name: { first: "Admin", middle: "abc", last: "User" },
        email: "admin@example.com",
        password: "password123",
        phone: "0501234569",
        image: {
            url: "http://example.com/img.jpg",
            alt: "profile picture"
        },
        address: {
            state: "IL",
            country: "Israel",
            city: "Arad",
            street: "Shoham",
            houseNumber: 5,
            zip: 8920435
        },
        isAdmin: true,
        isBusiness: false
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.LOCAL_DB);
        console.log('Connected to MongoDB');

        await User.deleteMany({});
        await Card.deleteMany({});

        const createdUsers = [];
        for (let userData of initialUsers) {
            userData.password = generatePassword(userData.password);
            const user = new User(userData);
            await user.save();
            createdUsers.push(user);
            console.log(`Created user: ${userData.email}`);
        }

        const businessUser = createdUsers.find(u => u.isBusiness);

        const initialCards = [
            {
                title: "Tech Solutions",
                subtitle: "IT Services",
                description: "Professional IT consulting and solutions for your business",
                phone: "050-4444444",
                email: "tech@example.com",
                web: "https://techsolutions.com",
                image: {
                    url: "https://example.com/image1.jpg",
                    alt: "Tech Solutions Logo"
                },
                address: {
                    state: "Israel",
                    country: "Israel",
                    city: "Tel Aviv",
                    street: "Rothschild",
                    houseNumber: 1,
                    zip: 12345
                },
                bizNumber: 1000001,
                user_id: businessUser._id.toString(),
                likes: []
            },
            {
                title: "Design Studio",
                subtitle: "Creative Design",
                description: "Modern design solutions for branding and marketing",
                phone: "050-5555555",
                email: "design@example.com",
                web: "https://designstudio.com",
                image: {
                    url: "https://example.com/image2.jpg",
                    alt: "Design Studio Logo"
                },
                address: {
                    state: "Israel",
                    country: "Israel",
                    city: "Haifa",
                    street: "HaNassi",
                    houseNumber: 50,
                    zip: 54321
                },
                bizNumber: 1000002,
                user_id: businessUser._id.toString(),
                likes: []
            },
            {
                title: "Coffee Shop",
                subtitle: "Premium Coffee",
                description: "Best coffee in town with cozy atmosphere",
                phone: "050-6666666",
                email: "coffee@example.com",
                web: "https://coffeeshop.com",
                image: {
                    url: "https://example.com/image3.jpg",
                    alt: "Coffee Shop Logo"
                },
                address: {
                    state: "Israel",
                    country: "Israel",
                    city: "Jerusalem",
                    street: "Jaffa",
                    houseNumber: 100,
                    zip: 99999
                },
                bizNumber: 1000003,
                user_id: businessUser._id.toString(),
                likes: []
            }
        ];

        for (let cardData of initialCards) {
            const card = new Card(cardData);
            await card.save();
            console.log(`Created card: ${cardData.title}`);
        }

        console.log('\nInitial data created successfully!');
        console.log('\nTest Credentials:');
        console.log('Regular User - email: regular@example.com, password: password123');
        console.log('Business User - email: business@example.com, password: password123');
        console.log('Admin User - email: admin@example.com, password: password123');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

seedDatabase();