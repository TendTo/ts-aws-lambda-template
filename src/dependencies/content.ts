import { DeleteCommand, DeleteCommandOutput, DynamoDBDocumentClient, GetCommand, GetCommandOutput, QueryCommand, UpdateCommand, UpdateCommandOutput } from '@aws-sdk/lib-dynamodb';
import { Ddb } from './utility';

class ContentBase {
    static readonly type: string;
    protected dbDocument: DynamoDBDocumentClient;

    constructor(protected _pk: string, protected _sk: string) {
        this.dbDocument = Ddb.getDBDocumentClient();
    }

    public get pk(): string {
        return this._pk;
    }

    public get sk(): string {
        return this._sk;
    }

    public async create(): Promise<this> {
        throw new Error("Method not implemented.");
    };

    public async delete(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async update(): Promise<this> {
        throw new Error("Method not implemented.");
    }

    public async get(): Promise<this> {
        throw new Error("Method not implemented.");
    }

    public static getAll() {
        throw new Error("Method not implemented.");
    };

    protected async _create(content: Record<string, any>, pk?: string, sk?: string): Promise<UpdateCommandOutput> {
        const putCommand = new UpdateCommand({
            TableName: process.env.TABLE_NAME ?? '',
            Key: {
                pk: pk ?? this._pk,
                sk: sk ?? this._sk,
            },
            ...Ddb.getPutExpression(content),
        });
        return await this.dbDocument.send(putCommand);
    }

    protected async _update(content: Record<string, any>, pk?: string, sk?: string): Promise<UpdateCommandOutput> {
        const putCommand = new UpdateCommand({
            TableName: process.env.TABLE_NAME ?? '',
            Key: {
                pk: pk ?? this._pk,
                sk: sk ?? this._sk,
            },
            ...Ddb.getUpdateExpression(content),
        });
        return await this.dbDocument.send(putCommand);
    }

    protected async _delete(pk?: string, sk?: string): Promise<DeleteCommandOutput> {
        const getCommand = new DeleteCommand({
            TableName: process.env.TABLE_NAME ?? '',
            Key: {
                pk: pk ?? this._pk,
                sk: sk ?? this._sk,
            }
        });
        return await this.dbDocument.send(getCommand);
    }

    protected async _read(pk?: string, sk?: string): Promise<GetCommandOutput> {
        const getCommand = new GetCommand({
            TableName: process.env.TABLE_NAME ?? '',
            Key: {
                pk: pk ?? this._pk,
                sk: sk ?? this._sk,
            }
        });
        return await this.dbDocument.send(getCommand);
    }
}


export class Author extends ContentBase {
    static readonly type = 'author';
    private content: Record<string, any>;

    constructor(pk: string, sk: string, public Name: string, public URL: string, public Address: string) {
        super(pk, sk);
        this._sk = Author.type;
        this.content = {
            Name: this.Name,
            URL: this.URL,
            Address: this.Address,
        };
    }

    public async create(): Promise<this> {
        const newId = `${Author.type}#${"v4()"}`;
        this._pk = newId;
        await this._create(this.content);
        return this;
    }

    public async delete(): Promise<void> {
        await this._delete();
    }
    public async update(): Promise<this> {
        await this._update(this.content);
        return this;
    }
    public async get(): Promise<this> {
        const res = await this._read();
        return this;
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
        if (!res.Items) {
            return null;
        }
        return res.Items.map(
            ({ pk, sk, Name, URL, Address }) => new Author(pk, sk, Name, URL, Address)
        );
    }


}

