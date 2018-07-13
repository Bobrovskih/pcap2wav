
import * as fs from 'fs';
import { promisify } from 'util';

const statAsync = promisify(fs.stat);
/**
 * Проверить существование файла/директории
 */
const existsAsync = async (path: fs.PathLike) => {
    try {
        await statAsync(path);
        return true;
    } catch (error) {
        return false;
    }
};

export {
    existsAsync,
};
