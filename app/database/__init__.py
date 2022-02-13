class Database():
    def __init__(self, adapter=None):
        self.client = adapter()

    def find_all(self, selector_dict):
        return self.client.find_all(selector_dict)

    def find(self, selector_dict):
        return self.client.find(selector_dict)

    def create(self, entry):
        return self.client.create(entry)

    def update(self, selector_dict, entry):
        return self.client.update(selector_dict, entry)

    def delete(self, selector_dict):
        return self.client.delete(selector_dict)