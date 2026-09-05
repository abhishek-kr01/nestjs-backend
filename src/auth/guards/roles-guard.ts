import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserRole } from "../entities/user.entity";
import { ROLES_KEY } from "../decorators/roles.decorators";

// route A
// workflow -> 
// client -> jwtauthguard -> validate the token and attech the current user in the request
// -> rolesguard check if current user role matches the required role -> if match found proceed the controller -> if not frobidden exception

@Injectable()
export class RolesGuard implements CanActivate{
    // Reflector -> utility than will help to access metadata

    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean{

        // retive the roles metadat set by the roles decorator

        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY, [
                context.getHandler(), // method level metadata
                context.getClass() // call level metadata
            ]
        );

        if(!requiredRoles){
            return true
        }

        const {user} = context.switchToHttp().getRequest();

        if(!user){
            throw new ForbiddenException('User not authenticated')
        }

        const hasRequiredRole = requiredRoles.some(role => user.role === role);

        if(!hasRequiredRole){
            throw new ForbiddenException('Insufficient permission')
        }

        return true;
    }
}