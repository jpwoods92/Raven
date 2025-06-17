Overview

The repository contains a full‑stack chat application called Raven. At the root level you’ll find Docker configuration, package information, and two top‑level folders – backend and frontend:

```pgsql
Dockerfile  docker-compose.dev.yml  heroku.yml
TODO.text   docker-compose.yml      package-lock.json
backend     frontend                package.json
```

The `package.json` exposes a helper script to spin up the development stack via Docker Compose:

```json
"scripts": {
  "compose:dev": "docker-compose -f docker-compose.dev.yml up"
}
```

Backend (NestJS)

The backend is implemented with the NestJS framework. `AppModule` configures the application with TypeORM for PostgreSQL, serves the built frontend assets, and registers feature modules such as authentication, rooms, messages, and users:

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ...
      autoLoadEntities: true,
      synchronize: true,
      retryAttempts: 10,
      retryDelay: 3000,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    UserModule,
    RoomModule,
    RoomMembershipModule,
    MessageModule,
    AuthModule,
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60, limit: 10 }],
    }),
  ],
})
export class AppModule {}
```

`main.ts` bootstraps the Nest application, enables WebSockets, and exposes Swagger documentation:

```typescript
const app = await NestFactory.create(AppModule);
app.enableCors();
app.useGlobalPipes(new ValidationPipe());
app.useWebSocketAdapter(new IoAdapter(app));

const config = new DocumentBuilder()
  .setTitle("Raven API")
  .setDescription("The Raven API documentation")
  .setVersion("1.0")
  .addBearerAuth()
  .build();

SwaggerModule.setup("api", app, document);
await app.listen(port, "0.0.0.0");
```

Entities in `src/entities` define the core database tables, such as User, shown partially below:

```typescript
@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;
  ...
}
```

Services provide business logic—for instance, `MessageService` validates access and persists messages:

```typescript
@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(RoomMembership)
    private roomMembershipRepository: Repository<RoomMembership>,
  ) {}

  async create(userId: string, createMessageDto: CreateMessageDto): Promise<Message> {
    const { roomId, content } = createMessageDto;
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }
    ...
  }
}
```

Real‑time communication uses a WebSocket gateway (`MessageGateway`) that handles events such as joining a room and broadcasting new messages:

```typescript
@WebSocketGateway({ cors: { origin: '*' } })
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private roomMembers: Map<string, Set<string>> = new Map();

  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    await client.join(`room:${roomId}`);
    ...
  }
}
```

Frontend (React)

The React frontend is built with TypeScript, Redux Toolkit, and Material UI. The entry point renders the app within a Redux provider and MUI theme:

```typescript
import { ThemeProvider } from "@mui/material";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import AppRouter from "./components/Router";
import { store } from "./store";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AppRouter />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
```

A custom hook (`useRoomSocket`) manages the Socket.IO connection for real‑time updates:

```typescript
export const useRoomSocket = ({ roomId }: RoomSocketProps = {}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string | undefined>(roomId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomMembers, setRoomMembers] = useState<string[]>([]);

  // Get authentication state from Redux
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token || !user) return;
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
    const newSocket = io(backendUrl, { auth: { token } });
    setSocket(newSocket);
    ...
  }, [token, user]);
  ...
};
```

Redux state is configured in `src/store/index.ts`, combining slices and RTK Query APIs:

```typescript
export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomReducer,
    modal: modalReducer,
    [userApi.reducerPath]: userApi.reducer,
    [roomApi.reducerPath]: roomApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      roomApi.middleware
    ),
});

setupListeners(store.dispatch);
```

RTK Query services handle HTTP calls to the backend—e.g., `authApi` sends login and registration requests:

```typescript
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    ...
  }),
});
```

Deployment & Docker

The top‑level Dockerfile builds the frontend and backend, then starts the backend server that serves both API routes and static frontend files:

```bash
# Build frontend
FROM node:23 AS frontend-build
...
RUN cd frontend && npm run build

# Build backend
FROM node:23 AS backend-build
...
RUN cd backend && npm run build

# Production stage
FROM node:23
WORKDIR /app
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/package*.json ./backend/
COPY --from=frontend-build /app/frontend/public ./backend/public
RUN cd backend && npm ci --only=production
WORKDIR /app/backend
CMD ["npm", "run", "start:prod"]
```

`docker-compose.yml` orchestrates PostgreSQL, the backend, and the frontend containers:

```yaml
services:
  postgres:
    image: postgres:latest
    ...
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "${BACKEND_PORT}:3000"
    depends_on:
      - postgres
    ...
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "${FRONTEND_PORT}:80"
    depends_on:
      - backend
...
```

Future Work

A `TODO.text` file enumerates planned features, such as improving authentication, adding direct messaging, voice/video chat, and UI enhancements:

```text
Add better auth and email validation ...
Add ability to have direct messages with other users
Add ability to share a join link to a room
Add p2p voice chat
Add p2p video chat
Add ability to create chat channels within a room
...
```

Getting Started

1. **Run the stack** – Execute the compose:dev script to start the database, backend, and frontend via Docker.

2. **Explore API routes** – Check the controllers under backend/src/controllers for REST endpoints. Swagger docs are hosted at /api when running the backend.

3. **Understand real‑time flow** – The WebSocket gateway in backend/src/gateways works with the frontend useRoomSocket hook for live chat updates.

4. **Study state management** – Redux Toolkit slices (src/slices) and RTK Query services (src/services) control frontend state and server communication.

5. **Experiment and extend** – Features like direct messaging or UI themes are outlined in TODO.text for future contributions.

This project is a solid example of combining NestJS, TypeORM, and React with Redux Toolkit for a real‑time chat application. Reviewing NestJS’s module system, Socket.IO usage, and RTK Query will help you get comfortable with the codebase and prepare you to implement new features.
