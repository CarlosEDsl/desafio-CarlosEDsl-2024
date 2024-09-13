import { encontrarRecinto } from "./RecintoManager";

class RecintosZoo {

    analisaRecintos(animal, quantidade) {
        return encontrarRecinto(animal, quantidade);
    }

}

export { RecintosZoo as RecintosZoo };
