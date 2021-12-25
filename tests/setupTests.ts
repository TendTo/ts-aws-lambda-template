import { DeleteCommand, DynamoDBDocumentClient, GetCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from "aws-sdk-client-mock";

/**
 * Setup the test's mocks
 */
function mockDynamoDBDocumentClient() {
    const mockArticle = {
        pk: "uuid_v4",
        sk: "article",
        title: "article_1",
        content: "content_1"
    };

    const mockDBClient = mockClient(DynamoDBDocumentClient)
        .on(GetCommand).resolves({ Item: mockArticle })
        .on(QueryCommand).resolves({ Items: [mockArticle, mockArticle] })
        .on(UpdateCommand).resolves({ Attributes: mockArticle })
        .on(DeleteCommand).resolves({ Attributes: mockArticle })

    global.mockDBClient = mockDBClient;
    global.mockArticle = mockArticle;
}

mockDynamoDBDocumentClient();

global.beforeEach(() => {
    global.mockDBClient.resetHistory();
});