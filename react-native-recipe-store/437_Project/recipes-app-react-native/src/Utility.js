export class Store {
    constructor(data) {
        this.name = data.name;
        this.image = data.image;
        this.ingredients = data.ingredients;
    }

}

export const awsIP = "http://ec2-3-86-208-16.compute-1.amazonaws.com:3000"
