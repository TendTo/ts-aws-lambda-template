type ContentBase = {
    pk: string,
    sk: string,
}

// pk = author#id - pk = author
export type Author = ContentBase & {
    Name: string,
    URL: string,
    Address: string,
};

// [GSI_1] sk = book#id - beginsWith(pk, "author#")
export type Book = ContentBase & {
    Title: string,
    Year: number,
    Price: number,
    fk_1: string,
};

// pk = publisher#id - sk = publisher
export type Publisher = ContentBase & {
    Name: string,
    URL: string,
    Phone: string,
};

// pk = warehouse#id - sk = warehouse
export type Warehouse = ContentBase & {
    Phone: string,
    Address: string,
};

// pk = customer#id - sk = customer
export type Customer = ContentBase & {
    Name: string,
    Phone: string,
    Address: string,
};

// pk = basket#id - sk = ""
// TODO: check basket structure
export type Basket = ContentBase & {
    Name: string,
    Phone: string,
    Address: string,
};

export type Content = {
    author: Author,
    book: Book,
    publisher: Publisher,
    warehouse: Warehouse,
    customer: Customer,
    basket: Basket,
}

export type ContentType = keyof Content;

export type DdbUpdateExpression = {
    UpdateExpression: string,
    ExpressionAttributeNames: {
        [x: string]: string;
    },
    ExpressionAttributeValues: {
        [x: string]: any;
    },
    ConditionExpression?: string,
}