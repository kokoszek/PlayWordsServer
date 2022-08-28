type Student = {
	[key: string]: number | boolean
}

const student: Student = {
	s1: 2,
	s2: true
}

type Employee = {
	name: string,
	salary: number
	freeParking: boolean
}

type Employer = {
	name: string,
	freeParking: boolean
}

type Point = {
	x: number,
	y: number
}

/**
 * below record defines an object whose keys are string and points are partial points,
 * so e.g. only 'x' might be provided as in below example.
 */
type PartialPoint = Record<string, Partial<Point>>;
let point: PartialPoint = {
	point1: {
		x: 2
	},
	point2: {
		x: 2,
		y: 3
	}
}

type Role = 'admin' | 'user';

type RoleInfo = {
	desc: string,
	importance: number
}

/**
 * without Partial, in 'role' we would need to provide all keys, so admin and user.
 * ...
 */
type RoleType = Record<Role, RoleInfo>;

let role: RoleType = {
	admin: {
		desc: 'admin role',
		importance: 2
	},
	user: {
		desc: 'user role',
		importance: 1
	}
}

/**
 *....
 * with Partial we can provide e.g only 'admin'. Cool
 */
type PartialRole = Partial<Record<Role, RoleInfo>>;

let partialRole: PartialRole = {
	admin: {
		desc: 'desc of role',
		importance: 2
	}
}

type Rec = Record<number, Employee | Point>;

const student2: Rec = {
	0: { name: 'Jack', salary: 200, freeParking: true },
	1: { x: 1, y: 0 },
	2: { name: 'Jessica', salary: 300, freeParking: true },
}

type seniorRole = 'manager';
type technicalRole = 'developer';
const benefits:  Partial<Record<seniorRole, 'Free Parking'> & Record<technicalRole, 'Free Coffee'>> = {};
benefits.manager = 'Free Parking';
//benefits.developer = 'Free Parking';//ERROR: no free parking for dev

let obj: {prop2: number} = {
	prop2: 2
};

let record: Record<any, any> = {};

console.log(record.props1);

obj.prop2;