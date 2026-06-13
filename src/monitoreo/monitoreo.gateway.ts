import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MonitoreoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  // Mapa de ciudadano_id -> socket (para notificaciones push a un usuario específico)
  private ciudadanosConectados = new Map<string, Socket>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.ciudadanosConectados.set(userId, client);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socket] of this.ciudadanosConectados.entries()) {
      if (socket === client) {
        this.ciudadanosConectados.delete(userId);
        break;
      }
    }
  }

  // Emitir ubicaciones de buses de una ruta a todos los suscriptores de esa ruta
  emitirUbicacionesRuta(rutaId: number, buses: any[]) {
    this.server.emit(`ruta-${rutaId}-buses`, buses);
  }

  // Emitir datos del panel de control a los supervisores (room 'panel')
  emitirEstadoPanel(datos: any) {
    this.server.emit('panel-estado', datos);
  }

  // Notificar a un ciudadano específico (bus cercano / clima)
  notificarCiudadano(ciudadanoId: string, evento: string, data: any) {
    const client = this.ciudadanosConectados.get(ciudadanoId);
    if (client) {
      client.emit(evento, data);
    }
  }
}