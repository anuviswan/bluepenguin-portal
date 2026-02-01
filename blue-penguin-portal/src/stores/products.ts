import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
    category: string;
    material: string;
    features: string[];
    collection?: string;
}

export const useProductsStore = defineStore('products', () => {
    // Mock Data based on the design image
    const products = ref<Product[]>([
        {
            id: 1,
            title: 'Blue Pearl Necklace',
            price: 45,
            image: '/images/necklace-1.jpg', // Placeholder path
            category: 'Necklace',
            material: 'Bead-Based',
            features: ['Handmade'],
            collection: 'Ocean Dreams'
        },
        {
            id: 2,
            title: 'Resin Ocean Pendant',
            price: 35,
            image: '/images/pendant-1.jpg',
            category: 'Necklace',
            material: 'Resin-Based',
            features: ['Handmade'],
            collection: 'Ocean Dreams'
        },
        {
            id: 3,
            title: 'Beaded Charm Bracelet',
            price: 30,
            image: '/images/bracelet-1.jpg',
            category: 'Bracelet',
            material: 'Bead-Based',
            features: ['Adjustable']
        },
        {
            id: 4,
            title: 'Crystal Drop Earrings',
            price: 40,
            image: '/images/earrings-1.jpg',
            category: 'Earrings',
            material: 'Bead-Based',
            features: ['Hypoallergenic']
        },
        {
            id: 5,
            title: 'Starfish Anklet',
            price: 25,
            image: '/images/anklet-1.jpg',
            category: 'Anklet',
            material: 'Bead-Based',
            features: ['Adjustable'],
            collection: 'Ocean Dreams'
        },
        {
            id: 6,
            title: 'Artisan Resin Ring',
            price: 28,
            image: '/images/ring-1.jpg',
            category: 'Ring',
            material: 'Resin-Based',
            features: ['Handmade']
        },
        {
            id: 7,
            title: 'Turquoise Bead Earrings',
            price: 32,
            image: '/images/earrings-2.jpg',
            category: 'Earrings',
            material: 'Bead-Based',
            features: ['Hypoallergenic']
        },
        {
            id: 8,
            title: 'Shell & Pearl Bracelet',
            price: 38,
            image: '/images/bracelet-2.jpg',
            category: 'Bracelet',
            material: 'Bead-Based',
            features: ['Handmade']
        },
        {
            id: 9,
            title: 'Glass Wave Pendant',
            price: 42,
            image: '/images/pendant-2.jpg',
            category: 'Necklace',
            material: 'Resin-Based',
            features: ['Handmade'],
            collection: 'Ocean Dreams'

        },
        {
            id: 10,
            title: 'Boho Bead Necklace',
            price: 50,
            image: '/images/necklace-2.jpg',
            category: 'Necklace',
            material: 'Bead-Based',
            features: ['Handmade']
        },
        {
            id: 11,
            title: 'Adjustable Resin Bangle',
            price: 34,
            image: '/images/bangle-1.jpg',
            category: 'Bracelet',
            material: 'Resin-Based',
            features: ['Handmade', 'Adjustable']
        },
        {
            id: 12,
            title: 'Lapis Drop Necklace',
            price: 48,
            image: '/images/necklace-3.jpg',
            category: 'Necklace',
            material: 'Bead-Based',
            features: ['Handmade']
        }
    ]);

    return {
        products
    };
});
