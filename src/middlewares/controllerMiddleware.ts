import { ControllerBase } from 'base/controllerBase';
import * as express from 'express';

export interface Type<T> extends Function {
  new (...args: any[]): T;
}

export function route(path: string) {
  return (constructor: any) => {
    constructor.attributes = constructor.attributes || {};
    constructor.attributes.route = path;
  };
}

export function httpGet(path: string) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value.attributes = descriptor.value.attributes || {};
    descriptor.value.attributes.httpGet = path;
  };
}

export function httpPost(path: string) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value.attributes = descriptor.value.attributes || {};
    descriptor.value.attributes.httpPost = path;
  };
}

export function httpPut(path: string) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value.attributes = descriptor.value.attributes || {};
    descriptor.value.attributes.httpPut = path;
  };
}

export function httpDelete(path: string) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value.attributes = descriptor.value.attributes || {};
    descriptor.value.attributes.httpDelete = path;
  };
}

export function stepMvc(
  app: express.Express,
  ...controllers: Type<ControllerBase>[]
) {
  for (let controller of controllers) {
    for (let method in controller.prototype) {
      let func = controller.prototype[method];

      let handler = (request, response, next) => {
        var argValues = [];
        for (var arg of args) {
          if (request.params[arg]) {
            argValues.push(request.params[arg]);
          } else {
            argValues.push(eval(arg));
          }
        }
        var result = (func as Function).apply(null, argValues);
        if (result) {
          response.json(result);
        }
      };

      let args = func.toString();
      args = args.substring(args.indexOf('(') + 1);
      args = args.substring(0, args.indexOf(')'));
      args = args.split(',').map(x => x.trim());

      if (func instanceof Function && func.attributes) {
        if (func.attributes.httpGet) {
          app.get(
            controller['attributes'].route + func.attributes.httpGet,
            handler
          );
        } else if (func.attributes.httpPost) {
          app.post(
            controller['attributes'].route + func.attributes.httpPost,
            handler
          );
        } else if (func.attributes.httpPut) {
          app.put(
            controller['attributes'].route + func.attributes.httpPut,
            handler
          );
        } else if (func.attributes.httpDelete) {
          app.delete(
            controller['attributes'].route + func.attributes.httpDelete,
            handler
          );
        }
      }
    }
  }
}
