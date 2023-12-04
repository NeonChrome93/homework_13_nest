export class Blog {
    constructor(
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean) {

    }
}


export type BlogsType =
    {

        "name": string,
        "description": string,
        "websiteUrl": string,
        "createdAt": string,
        "isMembership": boolean
    }
// export type BlogsOutputType =
//     {
//         "id": string,
//         "name": string,
//         "description": string,
//         "websiteUrl": string,
//         "createdAt": string,
//         "isMembership": boolean
//     }

export class BlogsOutputType {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership : Boolean
    ) {
    }
}

//export type mongoType = WithId<BlogsType>

export type BlogsQueryType = {
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    searchNameTerm: string | null
}

export type CreateBlogType =
    {
        "name": string,
        "description": string,
        "websiteUrl": string
    }

export class UpdateBlogType
    {
        "name": string
        "description": string
        "websiteUrl": string
    }
