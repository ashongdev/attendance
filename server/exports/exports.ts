export type CorsCallback = (error: Error | null, success: boolean) => void;

export interface Entity {
	id: string;
	fullname: string;
	index_number: string;
	groupid: string;
	coursecode: string;
	last_checked: Date;
	checked: string;
}

export interface LecturerType extends Omit<Entity, "index_number"> {
	coursename: string;
}
