import { NotFoundError, ValidationError } from "../exceptions/CustomError";
import transactionRepository from "../repository/transactionRepo";
import { TransactionDocument } from "../types/transactionType";
import { setKey, getKey, deleteKey } from "../config/redisClient";
class TransactionService {
  async createTransaction(
    transactionData: Partial<TransactionDocument>
  ): Promise<TransactionDocument | null> {
    const { transaction_type, amount, purpose } = transactionData;
    if (!transaction_type || !amount || !purpose) {
      throw new ValidationError("Insufficinet paramters");
    }
    const cacheExist = await getKey("transactions");
    if (cacheExist) {
      await deleteKey("transactions");
    }
    return await transactionRepository.create(transactionData);
  }

  async deleteTransaction(id: string): Promise<TransactionDocument | null> {
    const response = await transactionRepository.delete(id);
    if (!response) {
      throw new NotFoundError("Transaction with given Id not found");
    }
    const cacheExist = await getKey("transactions");
    if (cacheExist) {
      await deleteKey("transactions");
    }
    return response;
  }

  async updateTransaction(
    id: string,
    transactionData: Partial<TransactionDocument>
  ): Promise<TransactionDocument | null> {
    const response = await transactionRepository.update(id, transactionData);
    console.log(response);
    if (!response) {
      throw new NotFoundError("Transaction with given Id not found");
    }
    const cacheExist = await getKey("transactions");
    if (cacheExist) {
      await deleteKey("transactions");
    }
    return response;
  }
  async getAllTransactions(): Promise<TransactionDocument[] | null> {
    console.log("Into the service");
    let transactions = await getKey("transactions");
    if (!transactions) {
      try {
        const fetchedTransactions = await transactionRepository.getAll();
        await setKey("transactions", JSON.stringify(fetchedTransactions), 60);
        return fetchedTransactions;
      } catch (err) {
        console.error("Error getting all transactions:", err);
        throw new Error("Failed in getting all transactions");
      }
    } else {
      return JSON.parse(transactions);
    }
  }
  async getMacthedTransactions(
    searchTerm: string,
    filterBy: string
  ): Promise<TransactionDocument[] | null> {
    console.log("Into the service");
    console.log(searchTerm);
    try {
      return await transactionRepository.getMatched(searchTerm, filterBy);
    } catch (err) {
      console.error("Error in getting matched transactions:", err);
      throw new Error("Failed in getting matched transactions");
    }
  }
}

export default new TransactionService();
