import { Driver, QueryResult, Session, SessionMode, Transaction } from "neo4j-driver";
import type { AuthContext, CypherQueryOptions } from "../types";
export type ExecutionContext = Driver | Session | Transaction;
export type ExecutorConstructorParam = {
    executionContext: ExecutionContext;
    auth?: AuthContext;
    queryOptions?: CypherQueryOptions;
    database?: string;
    bookmarks?: string | string[];
};
export declare class Executor {
    private executionContext;
    lastBookmark: string | null;
    private queryOptions;
    private auth;
    private database;
    private bookmarks;
    constructor({ executionContext, auth, queryOptions, database, bookmarks }: ExecutorConstructorParam);
    execute(query: string, parameters: unknown, defaultAccessMode: SessionMode): Promise<QueryResult>;
    private formatError;
    private generateQuery;
    private generateParameters;
    private getSessionParam;
    private getTransactionConfig;
    private sessionRun;
    private transactionRun;
}
//# sourceMappingURL=Executor.d.ts.map