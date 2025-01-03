import { createClient } from "redis";

const client = createClient();
client.on('connect',()=>{
  console.log("Connected to redis");
})
client.connect();
export const setKey = async(key: string, value: string, expiry: number) => {
    await client.set(key, value, {'EX': expiry});
}
export const getKey = async(key: string) => {
    const value =  await client.get(key);
    return value;
}
export const deleteKey = async(key:string) =>{
  const exist = await client.get(key);
  if(exist){
    await client.del(key);
    console.log(key+" cache cleared");
  }
}
export default client;