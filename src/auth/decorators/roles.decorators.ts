import { SetMetadata } from "@nestjs/common"
import { UserRole } from "../entities/user.entity"

// -> unique identifire for storing and retriving role requirements as metadata on route handler

export const ROLES_KEY = 'roles';

// -> roles decorator makes the routes with the roles than are allowed to access them
// -> roles guard will later reads this metadat to check if the user has permission

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);