import { mkdirSync, readFileSync } from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import ignore from "ignore";

export async function ensureDirectoryExists(filepath: string) {
	const dirpath = path.dirname(filepath);

	await mkdir(dirpath, { recursive: true });
}

export function ensureDirectoryExistsSync(filepath: string) {
	const dirpath = path.dirname(filepath);

	mkdirSync(dirpath, { recursive: true });
}

/**
 * Generate a function that can match relative filepaths against a list of gitignore formatted patterns.
 */
export function createPatternMatcher(
	patterns: string[],
	exclude: boolean
): (filePath: string) => boolean {
	if (patterns.length === 0) {
		return (_filePath) => !exclude;
	} else {
		const ignorer = ignore().add(patterns);
		return (filePath) => ignorer.test(filePath).ignored;
	}
}

export function thrownIsDoesNotExistError(
	thrown: unknown
): thrown is Error & { code: "ENOENT" } {
	return (
		thrown instanceof Error && "code" in thrown && thrown.code === "ENOENT"
	);
}

export function maybeGetFile(filePath: string | URL) {
	try {
		return readFileSync(filePath, "utf8");
	} catch (e: unknown) {
		if (!thrownIsDoesNotExistError(e)) {
			throw e;
		}
	}
}
