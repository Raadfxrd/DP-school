import { OrderItem } from "@shared/types/OrderItem";

export class AdminPanelService {
    private apiUrl: string = viteConfiguration.API_URL;

    public async getProducts(): Promise<{
        products: OrderItem[];
        page: number;
        pages: number;
        limit: number;
    }> {
        const response: Response = await fetch(`${this.apiUrl}orderItems`);
        const responseBody: string = await response.text();
        return JSON.parse(responseBody);
    }

    public async getProduct(id: number): Promise<OrderItem> {
        const response: Response = await fetch(`${this.apiUrl}orderItems/${id}`);
        return response.json();
    }

    public async createProduct(product: OrderItem): Promise<{ errors: any[]; data: OrderItem }> {
        const response: Response = await fetch(this.apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });
        return response.json();
    }

    public async updateProduct(id: number, product: OrderItem): Promise<any> {
        const response: Response = await fetch(`${this.apiUrl}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });
        return response.json();
    }

    public async deleteProduct(id: number): Promise<void> {
        await fetch(`${this.apiUrl}/${id}`, {
            method: "DELETE",
        });
    }

    // public async uploadFile(fileName: string, dataUrl: string, overwrite: boolean = false): Promise<string> {
    //     try {
    //         const uploadResponse: string = await api.uploadFile(fileName, dataUrl, overwrite);
    //         if (typeof uploadResponse === "string") {
    //             return uploadResponse;
    //         } else {
    //             throw new Error("Upload failed");
    //         }
    //     } catch (error: any) {
    //         throw new Error(`Upload failed: ${error.message}`);
    //     }
    // }

    public async readFileAsDataURL(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader: FileReader = new FileReader();
            reader.onloadend = (): void => {
                if (typeof reader.result === "string") {
                    resolve(reader.result);
                } else {
                    reject(new Error("Failed to read file as data URL."));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}
