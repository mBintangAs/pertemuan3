export interface createFoodInput {
    name: string;
    description: string;
    foodType: string;
    category: string;
    readyTime: number;
    price: number;
}
export interface PhotoFoodUpdate{
    foodId:string,
    hapus:string,
}
export interface foodNameFind{
    name:string
}