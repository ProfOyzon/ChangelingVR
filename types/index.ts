export type Character = {
  id: string;
  name: string;
  role: string;
  age: string | number;
  height: string;
  nationality: string;
  bio: string;
  image: string;
  personality: string[];
  hobby: string[];
  prop: string[];
};

export type Promo = {
  title: string;
  description: string;
  image: string;
  alt: string;
};
