from embedding import vector_store

def retrieve_products(query: str, k: int = 25):
    results = vector_store.similarity_search(query, k=k)
    return results