import json

file_path = "data/products_1000.json"    

with open(file_path, "r") as file:
    data = json.load(file)

product = data[0]

print(f"{product["title"]} | {product["description"]} | {product["category"]} > {product["sub_category"]} | {product["brand"]}")
