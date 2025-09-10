from langchain_core.documents import Document
import json
from dotenv import load_dotenv
load_dotenv()

# Load the data
with open("../data/products_1000.json", "r") as file:
    data = json.load(file)

# Initialize the embedding model
from langchain_openai import OpenAIEmbeddings
embeddings = OpenAIEmbeddings(model="text-embedding-3-small") 

# Initialize the vector store
from langchain_core.vectorstores import InMemoryVectorStore
vector_store = InMemoryVectorStore(embeddings)

# Vector store the documents
def vector_store_data(documents: list[Document]) -> list[str]:
    print("Vector Storing...")
    return vector_store.add_documents(documents=documents)

# Create the documents
documents = [
    Document(
        page_content=f"{product["title"]} | {product["description"]} | {product["category"]} > {product["sub_category"]} | {product["brand"]}",
        metadata={
            "_id": product["_id"],
            "title": product["title"],
            "description": product["description"],
            "category": product["category"],
            "sub_category": product["sub_category"],
            "brand": product["brand"],
            "images": [image for image in product["images"]],
            "actual_price": product["actual_price"]
        }
    ) for product in data
]

# Vector store the documents
vector_store_data(documents)