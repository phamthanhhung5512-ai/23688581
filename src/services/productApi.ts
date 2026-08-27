import {PRICE_MULTIPLIER} from '@constants/student';

export type CategoryId = 'all' | 'food' | 'drink' | 'study';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: CategoryId;
  description: string;
}

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(
    'https://fakestoreapi.com/products?limit=8',
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();

  return data.map((item: any) => {
    let category: CategoryId = 'food';
    if (item.category.includes('clothing')) {
      category = 'study';
    } else if (item.category.includes('jewel')) {
      category = 'drink';
    }

    return {
      id: item.id,
      name: item.title,
      price: Math.round(item.price * PRICE_MULTIPLIER),
      image: item.image,
      category,
      description: item.description,
    };
  });
};