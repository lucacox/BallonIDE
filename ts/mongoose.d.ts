///<reference path='node.d.ts' />

export = M;

declare module M {

    export interface Mongoose {
        constructor();
        set (key: string, value: string): Mongoose;
        get (key: string): string;
        createConnection(uri?: string, options?: any): Connection;

        connect(any): Mongoose;

        disconnect(fn: (err?: any) => void ): Mongoose;
        model(name: string, schema?: Schema, collection?: string, skipInit?: boolean): Model;
        modelNames(): string[];
        plugin(fn: (any) => any, opts?: any): Mongoose;
        mongo: any;
        version: string;
        connection: Connection;
    }

    export function set(key: string, value: string): Mongoose;
    export function get(key: string): string;
    export function createConnection(uri ? : string, options?: any): Connection;

    export function connect(any): Mongoose;

    export function disconnect(fn: (err?: any) => void ): Mongoose;
    export function model(name: string, schema?: Schema, collection?: string, skipInit?: boolean): Model;
    export function modelNames(): string[];
    export function plugin(fn: (any) => any, opts?: any): Mongoose;
    export var mongo: any;
    export var version: string;
    export var connection: Connection;
    
    export class Collection {
        name: string;
    }

    export class Connection implements EventEmitter {
        constructor(base: Mongoose);

        addListener(event: string, listener: Function);
        on(event: string, listener: Function);
        once(event: string, listener: Function): void;
        removeListener(event: string, listener: Function): void;
        removeAllListeners(event?: string): void;
        setMaxListeners(n: number): void;
        listeners(event: string): { Function; }[];
        emit(event: string, ...args: any[]): void;

        open(connection_string: string,
             database?: string,
             port?: number,
             options?: any,
             callback?: (any) => any): Connection;

        openSet(uris: string,
                database?: string,
                options?: any,
                callback?: (any) => any): Connection;

        close(callback?: (any) => any): Connection;
        collection(name: string, options?: any): Collection;
        model(name: string, schema?: Schema, collection?: string): Model;
        modelNames(): string[];
        setProfiling(level: number, ms: number, callback: (any) => any): any;
        db: any;
        collections: any;
        readyState: number;
    }

    export class Schema {
        constructor(definition: any, options?: any);
        static Types: {
            ObjectId: any;
            Mixed: any;
        };

        methods: any;
        statics: any;
        path(path: string): any;
        virtual(path: string): any;
        pre(method: string, callback: (next: (any?) => any) => any): void;
    }

    export class SchemaType { }

    export class VirtualType { }

    export class Query<T extends Document> {
        exec(): Promise;
        exec(operation: string): Promise;
        exec(callback: (err: any, res: T[]) => any): Promise;
        exec(operation: string, callback: (err: any, res: T[]) => void ): Promise;

        skip(x: number): Query;
        limit(x: number): Query;
    }

    export class Promise { }

    export interface Model<T extends Document> {
        new (any): Document;

        find(conditions: any): Query<T>;
        find(conditions: any, fields: any): Query<T>;
        find(conditions: any, fields: any, options: any): Query<T>;
        find(conditions: any, fields: any, options: any, callback: (err: any, res: any) => void ): Query<T>;
        find(conditions: any, callback: (err: any, res: T[]) => void ): Query<T>;
        find(conditions: any, fields: any, callback: (err: any, res: T[]) => void ): Query<T>;

        findOne(conditions: any): Query<T>;
        findOne(conditions: any, fields: any): Query<T>;
        findOne(conditions: any, fields: any, options: any): Query<T>;
        findOne(conditions: any, fields: any, options: any, callback: (err: any, res: T) => void ): Query<T>;
        findOne(conditions: any, callback: (err: any, res: T) => void ): Query<T>;
        findOne(conditions: any, fields: any, callback: (err: any, res: T) => void ): Query<T>;

        findById(id: string): Query<T>;
        findById(id: string, fields: any): Query<T>;
        findById(id: string, fields: any, options: any): Query<T>;
        findById(id: string, fields: any, options: any, callback: (err: any, res: T) => void ): Query<T>;
        findById(id: string, callback: (err: any, res: T) => void ): Query<T>;
        findById(id: string, fields: any, callback: (err: any, res: T) => void ): Query<T>;

        findByIdAndUpdate(id: string): Query<T>;
        findByIdAndUpdate(id: string, update: any): Query<T>;
        findByIdAndUpdate(id: string, update: any, options: any): Query<T>;
        findByIdAndUpdate(id: string, update: any, options: any, callback: (err: any, res: T[]) => void ): Query<T>;
        findByIdAndUpdate(id: string, callback: (err: any, res: T[]) => void ): Query<T>;
        findByIdAndUpdate(id: string, update: any, callback: (err: any, res: T[]) => void ): Query<T>;

        update(conditions: any,
               update: any,
               options?: any,
               callback?: (err: any, affectedRows: number, raw: any) => void ): Query<T>;
        update(conditions: any,
               update: any,
               callback?: (err: any, affectedRows: number, raw: any) => void ): Query<T>;

        create(doc: any, fn: (err: any, res: T) => void ): void;

        collection: Collection;

        remove(conditions: any, callback?: (err) => void): Query<T>;
    }
    /*
    export var Model: {
        (any);
        constructor(doc?: any);
        new (any);

        find(conditions: any): Query;
        find(conditions: any, fields: any): Query;
        find(conditions: any, fields: any, options: any): Query;
        find(conditions: any, fields: any, options: any, callback: (err: any, res: any) => void ): Query;
        find(conditions: any, callback: (err: any, res: any) => void ): Query;
        find(conditions: any, fields: any, callback: (err: any, res: any) => void ): Query;

        findById(id: string): Query;
        findById(id: string, fields: any): Query;
        findById(id: string, fields: any, options: any): Query;
        findById(id: string, fields: any, options: any, callback: (err: any, res: any) => void ): Query;
        findById(id: string, callback: (err: any, res: any) => void ): Query;
        findById(id: string, fields: any, callback: (err: any, res: any) => void ): Query;

        collection: Collection;
    }*/

    export interface Document {
        _id: string;
        update<T extends Document>(doc: any, options: any, callback: (err: any, affectedRows: number, raw: any) => void ): Query<T>;
        save<T extends Document>(fn?: (err: any, res: T) => void ): void;
        remove<T extends Document>(callback?: (err) => void ): Query<T>;
    }

    export class MongooseError { }

    export class Types { }

    export class SchemaTypes { }
}


    
