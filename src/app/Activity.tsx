import { useEffect, useRef, useState } from 'react';
import { useDiscordSdk } from '../hooks/useDiscordSdk'
import { useSyncState } from '@robojs/sync'
import { Events, Types } from '@discord/embedded-app-sdk';

export const Activity = () => {
    const { discordSdk, session } = useDiscordSdk();

    discordSdk.ready();

    if (!session) {
        return <div>Loading...</div>;
    }

    interface Player {
        id: string,
        username: string,
        avatar: string,
        isPlaying: boolean,
        joinCooldown: number,
        xPos: number,
        yPos: number,
        xVel: number,
        yVel: number,
        bounceCooldown: number,
        age: number
    };

    const [message, setMessage] = useState<string | null>(null);

    const [playerIds, setPlayerIds] = useSyncState<string[] | null>(null, ['playerIds', discordSdk.instanceId]);

    const [player1Ident, setPlayer1Ident] = useSyncState<{ id: string, username: string, avatar: string } | null>(null, ['player1Ident', discordSdk.instanceId]);
    const [player1State, setPlayer1State] = useSyncState<{ isPlaying: boolean, joinCooldown: number } | null>(null, ['player1State', discordSdk.instanceId]);
    const [player1Pos, setPlayer1Pos] = useSyncState<{ x: number, y: number } | null>(null, ['player1Pos', discordSdk.instanceId]);
    const [player1Bounce, setPlayer1Bounce] = useSyncState<{ xVel: number, yVel: number, bounceCooldown: number } | null>(null, ['player1Bounce', discordSdk.instanceId]);
    const [player1Age, setPlayer1Age] = useSyncState<number | null>(null, ['player1Age', discordSdk.instanceId]);

    const [player2Ident, setPlayer2Ident] = useSyncState<{ id: string, username: string, avatar: string } | null>(null, ['player2Ident', discordSdk.instanceId]);
    const [player2State, setPlayer2State] = useSyncState<{ isPlaying: boolean, joinCooldown: number } | null>(null, ['player2State', discordSdk.instanceId]);
    const [player2Pos, setPlayer2Pos] = useSyncState<{ x: number, y: number } | null>(null, ['player2Pos', discordSdk.instanceId]);
    const [player2Bounce, setPlayer2Bounce] = useSyncState<{ xVel: number, yVel: number, bounceCooldown: number } | null>(null, ['player2Bounce', discordSdk.instanceId]);
    const [player2Age, setPlayer2Age] = useSyncState<number | null>(null, ['player2Age', discordSdk.instanceId]);

    const [player3Ident, setPlayer3Ident] = useSyncState<{ id: string, username: string, avatar: string } | null>(null, ['player3Ident', discordSdk.instanceId]);
    const [player3State, setPlayer3State] = useSyncState<{ isPlaying: boolean, joinCooldown: number } | null>(null, ['player3State', discordSdk.instanceId]);
    const [player3Pos, setPlayer3Pos] = useSyncState<{ x: number, y: number } | null>(null, ['player3Pos', discordSdk.instanceId]);
    const [player3Bounce, setPlayer3Bounce] = useSyncState<{ xVel: number, yVel: number, bounceCooldown: number } | null>(null, ['player3Bounce', discordSdk.instanceId]);
    const [player3Age, setPlayer3Age] = useSyncState<number | null>(null, ['player3Age', discordSdk.instanceId]);

    const [player4Ident, setPlayer4Ident] = useSyncState<{ id: string, username: string, avatar: string } | null>(null, ['player4Ident', discordSdk.instanceId]);
    const [player4State, setPlayer4State] = useSyncState<{ isPlaying: boolean, joinCooldown: number } | null>(null, ['player4State', discordSdk.instanceId]);
    const [player4Pos, setPlayer4Pos] = useSyncState<{ x: number, y: number } | null>(null, ['player4Pos', discordSdk.instanceId]);
    const [player4Bounce, setPlayer4Bounce] = useSyncState<{ xVel: number, yVel: number, bounceCooldown: number } | null>(null, ['player4Bounce', discordSdk.instanceId]);
    const [player4Age, setPlayer4Age] = useSyncState<number | null>(null, ['player4Age', discordSdk.instanceId]);

    const getPlayerId = (): number | null => {
        let playerIndex = playerIds?.indexOf(session.user.id);

        if (playerIndex === undefined) {
            return null;
        }

        return playerIndex + 1;
    };

    const getPlayer = (): Player | null => {
        let playerId = getPlayerId();

        if (!playerId) {
            return null;
        }

        return getPlayerById(playerId);
    };

    const getPlayerById = (id: number): Player | null => {
        switch (id) {
            case 1:
                if (!player1Ident?.id) {
                    return null;
                }

                return {
                    id: player1Ident.id,
                    username: player1Ident.username,
                    avatar: player1Ident.avatar,
                    isPlaying: player1State?.isPlaying ?? false,
                    joinCooldown: player1State?.joinCooldown ?? 3,
                    xPos: player1Pos?.x ?? 0,
                    yPos: player1Pos?.y ?? 0,
                    xVel: player1Bounce?.xVel ?? 0,
                    yVel: player1Bounce?.yVel ?? 4,
                    bounceCooldown: player1Bounce?.bounceCooldown ?? 0,
                    age: player1Age ?? 0
                };
            case 2:
                if (!player2Ident?.id) {
                    return null;
                }

                return {
                    id: player2Ident.id,
                    username: player2Ident.username,
                    avatar: player2Ident.avatar,
                    isPlaying: player2State?.isPlaying ?? false,
                    joinCooldown: player2State?.joinCooldown ?? 3,
                    xPos: player2Pos?.x ?? 0,
                    yPos: player2Pos?.y ?? 0,
                    xVel: player2Bounce?.xVel ?? 0,
                    yVel: player2Bounce?.yVel ?? 4,
                    bounceCooldown: player2Bounce?.bounceCooldown ?? 0,
                    age: player2Age ?? 0
                };
            case 3:
                if (!player3Ident?.id) {
                    return null;
                }

                return {
                    id: player3Ident.id,
                    username: player3Ident.username,
                    avatar: player3Ident.avatar,
                    isPlaying: player3State?.isPlaying ?? false,
                    joinCooldown: player3State?.joinCooldown ?? 3,
                    xPos: player3Pos?.x ?? 0,
                    yPos: player3Pos?.y ?? 0,
                    xVel: player3Bounce?.xVel ?? 0,
                    yVel: player3Bounce?.yVel ?? 4,
                    bounceCooldown: player3Bounce?.bounceCooldown ?? 0,
                    age: player3Age ?? 0
                };
            case 4:
                if (!player4Ident?.id) {
                    return null;
                }

                return {
                    id: player4Ident.id,
                    username: player4Ident.username,
                    avatar: player4Ident.avatar,
                    isPlaying: player4State?.isPlaying ?? false,
                    joinCooldown: player4State?.joinCooldown ?? 3,
                    xPos: player4Pos?.x ?? 0,
                    yPos: player4Pos?.y ?? 0,
                    xVel: player4Bounce?.xVel ?? 0,
                    yVel: player4Bounce?.yVel ?? 4,
                    bounceCooldown: player4Bounce?.bounceCooldown ?? 0,
                    age: player4Age ?? 0
                };
            default:
                return null;
        }
    }

    const setPlayerIdent = (player: Player) => {
        let playerId = getPlayerId();

        if (!playerId) {
            return;
        }

        switch (playerId) {
            case 1:
                setPlayer1Ident({ id: player.id, username: player.username, avatar: player.avatar });
                break;
            case 2:
                setPlayer2Ident({ id: player.id, username: player.username, avatar: player.avatar });
                break;
            case 3:
                setPlayer3Ident({ id: player.id, username: player.username, avatar: player.avatar });
                break;
            case 4:
                setPlayer4Ident({ id: player.id, username: player.username, avatar: player.avatar });
                break;
            default:
                break;
        }
    };

    const setPlayerState = (player: Player) => {
        let playerId = getPlayerId();

        if (!playerId) {
            return;
        }

        switch (playerId) {
            case 1:
                setPlayer1State({ isPlaying: player.isPlaying, joinCooldown: player.joinCooldown });
                break;
            case 2:
                setPlayer2State({ isPlaying: player.isPlaying, joinCooldown: player.joinCooldown });
                break;
            case 3:
                setPlayer3State({ isPlaying: player.isPlaying, joinCooldown: player.joinCooldown });
                break;
            case 4:
                setPlayer4State({ isPlaying: player.isPlaying, joinCooldown: player.joinCooldown });
                break;
            default:
                break;
        }
    };

    const setPlayerPos = (player: Player) => {
        let playerId = getPlayerId();

        if (!playerId) {
            return;
        }

        switch (playerId) {
            case 1:
                setPlayer1Pos({ x: player.xPos, y: player.yPos });
                break;
            case 2:
                setPlayer2Pos({ x: player.xPos, y: player.yPos });
                break;
            case 3:
                setPlayer3Pos({ x: player.xPos, y: player.yPos });
                break;
            case 4:
                setPlayer4Pos({ x: player.xPos, y: player.yPos });
                break;
            default:
                break;
        }
    };

    const setPlayerBounce = (player: Player) => {
        let playerId = getPlayerId();

        if (!playerId) {
            return;
        }

        switch (playerId) {
            case 1:
                setPlayer1Bounce({ xVel: player.xVel, yVel: player.yVel, bounceCooldown: player.bounceCooldown });
                break;
            case 2:
                setPlayer2Bounce({ xVel: player.xVel, yVel: player.yVel, bounceCooldown: player.bounceCooldown });
                break;
            case 3:
                setPlayer3Bounce({ xVel: player.xVel, yVel: player.yVel, bounceCooldown: player.bounceCooldown });
                break;
            case 4:
                setPlayer4Bounce({ xVel: player.xVel, yVel: player.yVel, bounceCooldown: player.bounceCooldown });
                break;
            default:
                break;
        }
    };

    const setPlayerAge = (player: Player) => {
        let playerId = getPlayerId();

        if (!playerId) {
            return;
        }

        switch (playerId) {
            case 1:
                setPlayer1Age(player.age);
                break;
            case 2:
                setPlayer2Age(player.age);
                break;
            case 3:
                setPlayer3Age(player.age);
                break;
            case 4:
                setPlayer4Age(player.age);
                break;
            default:
                break;
        }
    };

    const initPlayer = () => {
        let playerId = getPlayerId();

        if (!playerId) {
            return;
        }

        let player = getPlayer();

        if (player) {
            return null;
        }

        resetPlayer();
    }

    const resetPlayer = () => {
        let player = { id: session.user.id, username: session.user.username, avatar: session.user.avatar ?? "", isPlaying: false, joinCooldown: 3, xPos: 0, yPos: 0, xVel: 0, yVel: 0, bounceCooldown: 0, age: 0 };

        setPlayerIdent(player);
        setPlayerState(player);
        setPlayerPos(player);
        setPlayerBounce(player);
        setPlayerAge(player);
    }

    const getBigBub = (): number | null => {
        let player1Age = getPlayerById(1)?.age ?? -1;
        let player2Age = getPlayerById(2)?.age ?? -1;
        let player3Age = getPlayerById(3)?.age ?? -1;
        let player4Age = getPlayerById(4)?.age ?? -1;

        let maxAge = Math.max(player1Age, player2Age, player3Age, player4Age);

        if (maxAge <= 0) {
            return null;
        }

        if (maxAge == player1Age) {
            return 1;
        }

        if (maxAge == player2Age) {
            return 2;
        }

        if (maxAge == player3Age) {
            return 3;
        }

        if (maxAge == player4Age) {
            return 4;
        }

        return null;
    }

    //keep track of new players
    useEffect(() => {
        const updatePlayers = (response: Types.GetActivityInstanceConnectedParticipantsResponse) => {
            let updatedPlayerIds = playerIds ?? [];

            response.participants.forEach(participant => {
                if (!updatedPlayerIds.find(id => id == participant.id)) {
                    updatedPlayerIds.push(participant.id);
                }
            });

            setPlayerIds(updatedPlayerIds);
        }

        discordSdk.commands.getInstanceConnectedParticipants().then(() => {
            discordSdk.subscribe(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, updatePlayers);
        });

        return () => {
            discordSdk.unsubscribe(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, updatePlayers);
        }
    }, []);

    useEffect(() => {
        initPlayer();
    }, [session, playerIds])

    //cooldown to join/rejoin game
    useEffect(() => {
        const interval = setInterval(() => {
            let player = getPlayer();
            if (!player) {
                return;
            }

            if (player.joinCooldown > 0) {
                player.joinCooldown = player.joinCooldown - 1;
                setPlayerState(player);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [playerIds, player1State, player2State, player3State, player4State]);

    //physics
    useEffect(() => {
        const interval = setInterval(() => {
            let player = getPlayer();
            if (!player) {
                return;
            }
            if (player.isPlaying) {
                player.xPos = player.xPos + player.xVel;
                player.yPos = player.yPos + player.yVel;
                player.age = player.age + 1;
                setPlayerAge(player);
                setPlayerPos(player);
            }
        }, 33);

        return () => clearInterval(interval);
    }, [playerIds, player1Pos, player1Bounce, player1State, player2Pos, player2Bounce, player2State, player3Pos, player3Bounce, player3State, player4Pos, player4Bounce, player4State]);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    //handle clicks
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const handleClick = (event: MouseEvent) => {
            let player = getPlayer();
            if (!player) {
                return;
            }

            if (player.isPlaying) {
                const deltaX = player.xPos - event.offsetX;
                const deltaY = player.yPos - event.offsetY;
                const magnitude = Math.sqrt(deltaX ** 2 + deltaY ** 2);

                player.xVel = deltaX * 5 / magnitude;
                player.yVel = deltaY * 5 / magnitude;

                setPlayerBounce(player);
            }
            else if (!player.joinCooldown) {
                player.isPlaying = true;
                player.joinCooldown = 0;
                player.xPos = event.offsetX;
                player.yPos = event.offsetY;
                player.xVel = 0;
                player.yVel = 4;
                player.bounceCooldown = 0;

                setPlayerPos(player);
                setPlayerBounce(player);
                setPlayerState(player);
            }
        };

        canvas.addEventListener("click", handleClick);

        return () => {
            canvas.removeEventListener("click", handleClick);
        }
    }, [playerIds, player1Bounce, player1State, player2Bounce, player2State, player3Bounce, player3State, player4Bounce, player4State]);

    const requestRef = useRef<number>(null);
    const bubbleImage = useRef<HTMLImageElement | null>(null);
    const avatarImages = useRef<Record<string, HTMLImageElement>>({});

    useEffect(() => {
        bubbleImage.current = new Image(32, 32);
        bubbleImage.current.src = "/bubble.png";

        for (let i = 1; i <= 4; i++) {
            const player = getPlayerById(i);
            if (player?.avatar && !avatarImages.current[i]) {
                const img = new Image(24, 24);
                img.src = `https://cdn.discordapp.com/avatars/${player.id}/${player.avatar}`;
                avatarImages.current[i] = img;
            }
        }
    }, [playerIds, player1Ident, player2Ident, player3Ident, player4Ident]);

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const context = canvas.getContext("2d");
        if (!context) {
            return;
        }

        context.fillStyle = "blue";
        context.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 1; i <= 4; i++) {
            let player = getPlayerById(i);
            if (player?.isPlaying) {
                if (bubbleImage.current) {
                    context.drawImage(bubbleImage.current, player.xPos - 16, player.yPos - 16);
                }

                const avatar = avatarImages.current[i];
                if (avatar) {
                    context.save();
                    context.globalAlpha = 0.5;
                    context.drawImage(avatar, player.xPos - 12, player.yPos - 12, 24, 24);
                    context.restore();
                }
            }
        }

        requestRef.current = requestAnimationFrame(draw);
    };

    //draw all players' bubbles
    useEffect(() => {
        requestRef.current = requestAnimationFrame(draw);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        }
    }, [playerIds, player1Ident, player1State, player1Pos, player2Ident, player2State, player2Pos, player3Ident, player3State, player3Pos, player4Ident, player4State, player4Pos]);//[player1Ident?.avatar, player2Ident?.avatar, player3Ident?.avatar, player4Ident?.avatar]);

    useEffect(() => {
        let player = getPlayer();
        if (!player) {
            return;
        }

        if (player.xPos < 0 || player.xPos > 300 || player.yPos < 0 || player.yPos > 600) {
            setMessage("You died!");
            resetPlayer();
        }
    }, [playerIds, player1Pos, player2Pos, player3Pos, player4Pos]);

    useEffect(() => {
        let playerId = getPlayerId();
        if (!playerId) {
            return;
        }

        let player = getPlayer();
        if (!player) {
            return;
        }

        let bigBub = getBigBub();

        if (!bigBub) {
            return;
        }

        if (bigBub == playerId) {
            setMessage("You are the Big Bub!");
        }
        else {
            let bigBubPlayer = getPlayerById(bigBub);
            if (!bigBubPlayer?.username) {
                return;
            }

            setMessage(`${bigBubPlayer.username} is the Big Bub`);
        }
    }, [playerIds, player1Age, player2Age, player3Age, player4Age]);

    return (
        <div>
            <canvas id="bubbleDaddyCanvas" ref={canvasRef} width="300" height="600"></canvas>
            <div>
                {message}
            </div>
            <div>
                Your age: {getPlayer()?.age}
            </div>
            <div>
                Cooldown: {getPlayer()?.joinCooldown ?? 1 > 0 ? getPlayer()?.joinCooldown : 'Ready'}
            </div>
            <div>
                Player 1: {player1Ident?.username}
            </div>
            <div>
                Player 2: {player2Ident?.username}
            </div>
            <div>
                Player 3: {player3Ident?.username}
            </div>
            <div>
                Player 4: {player4Ident?.username}
            </div>
        </div>
    )
}