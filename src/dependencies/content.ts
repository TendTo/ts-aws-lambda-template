import { DeleteCommand, DeleteCommandOutput, DynamoDBDocumentClient, GetCommand, GetCommandOutput, QueryCommand, UpdateCommand, UpdateCommandOutput } from '@aws-sdk/lib-dynamodb';
import { v4 } from 'uuid';
import { Ddb } from './utility';
import { AuthorFields, Content, ContentType } from './types/ddb';

class ContentBase<T extends Content[keyof Content]> {
    static readonly type: string;
    protected dbDocument: DynamoDBDocumentClient;

    constructor(protected content: Partial<T>) {
        this.dbDocument = Ddb.getDBDocumentClient();
    }

    public get pk(): string {
        return this.content.pk;
    }

    public get sk(): string {
        return this.content.sk;
    }

    public static async delete(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async update(): Promise<this> {
        throw new Error("Method not implemented.");
    }

    protected static async _create<T extends Partial<Content[keyof Content]>>(content: T): Promise<UpdateCommandOutput> {
        const putCommand = new UpdateCommand({
            TableName: process.env.TABLE_NAME ?? '',
            Key: {
                pk: content.pk,
                sk: content.sk,
            },
            ...Ddb.getPutExpression(content),
        });
        const dbDocument = Ddb.getDBDocumentClient();
        return await dbDocument.send(putCommand);
    }

    protected static async _update<T extends Partial<Content[keyof Content]>>(pk: string, sk: string, content: T): Promise<UpdateCommandOutput> {
        const putCommand = new UpdateCommand({
            TableName: process.env.TABLE_NAME ?? '',
            Key: {
                pk: pk,
                ...sk && { sk: sk },
            },
            ...Ddb.getUpdateExpression(content),
        });
        const dbDocument = Ddb.getDBDocumentClient();
        return await dbDocument.send(putCommand);
    }

    protected static async _delete(pk: string, sk?: string): Promise<DeleteCommandOutput> {
        const getCommand = new DeleteCommand({
            TableName: process.env.TABLE_NAME ?? '',
            Key: {
                pk: pk,
                ...sk && { sk: sk },
            }
        });
        const dbDocument = Ddb.getDBDocumentClient();
        return await dbDocument.send(getCommand);
    }

    protected static async _read(pk: string, sk?: string): Promise<GetCommandOutput> {
        const getCommand = new GetCommand({
            TableName: process.env.TABLE_NAME ?? '',
            Key: {
                pk: pk,
                ...sk && { sk: sk },
            }
        });
        const dbDocument = Ddb.getDBDocumentClient();
        return await dbDocument.send(getCommand);
    }
}


export class Author extends ContentBase<AuthorFields> {
    static readonly type = 'author';

    private constructor(content: Partial<AuthorFields>) {
        super(content);
    }

    public get Name(): string {
        return this.content.Name;
    }

    public get URL(): string {
        return this.content.URL;
    }

    public get Address(): string {
        return this.content.Address;
    }

    public static async create(contentFields: Omit<AuthorFields, "pk" | "sk">): Promise<Author> {
        const newId = `${Author.type}#${v4()}`;
        const newAuthor = Object.assign(contentFields, { pk: newId, sk: Author.type });
        await this._create(newAuthor);
        return new Author(newAuthor);
    }

    public async delete(): Promise<void> {
        await Author._delete(this.pk, this.sk);
    }
    public async update(): Promise<this> {
        await Author._update(this.pk, this.sk, this.content);
        return this;
    }

    public static async get(pk: string): Promise<Author> {
        const res = await Author._read(pk, Author.type);
        return new Author(res.Item);
    }

    public static async getAll(): Promise<Author[]> {
        const queryCommand = new QueryCommand({
            TableName: process.env.TABLE_NAME ?? '',
            KeyConditionExpression: "#pk = :pk and #sk = :sk",
            ExpressionAttributeNames: {
                '#pk': 'pk',
                '#sk': 'sk',
            },
            ExpressionAttributeValues: {
                ':sk': this.type,
            }
        });
        const dbDocument = Ddb.getDBDocumentClient();
        const res = await dbDocument.send(queryCommand);
        return res.Items.map(item => new Author(item));
    }
}

