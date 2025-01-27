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
    const [player1, setPlayer1] = useSyncState<Player | null>(null, ['player1', discordSdk.instanceId]);
    const [player2, setPlayer2] = useSyncState<Player | null>(null, ['player2', discordSdk.instanceId]);
    const [player3, setPlayer3] = useSyncState<Player | null>(null, ['player3', discordSdk.instanceId]);
    const [player4, setPlayer4] = useSyncState<Player | null>(null, ['player4', discordSdk.instanceId]);

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
                return player1;
            case 2:
                return player2;
            case 3:
                return player3;
            case 4:
                return player4;
            default:
                return null;
        }
    }

    const setPlayer = (player: Player) => {
        let playerId = getPlayerId();

        if (!playerId) {
            return;
        }

        switch (playerId) {
            case 1:
                setPlayer1(player);
                break;
            case 2:
                setPlayer2(player);
                break;
            case 3:
                setPlayer3(player);
                break;
            case 4:
                setPlayer4(player);
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
        setPlayer({ id: session.user.id, username: session.user.username, avatar: session.user.avatar ?? "", isPlaying: false, joinCooldown: 3, xPos: 0, yPos: 0, xVel: 0, yVel: 0, bounceCooldown: 0, age: 0 });
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

    useEffect(() => {
        const interval = setInterval(() => {
            let player = getPlayer();
            if (!player) {
                return;
            }
    
            if (!player.isPlaying) {
                return;
            }

            player.age = player.age + 1;
            setPlayer(player);
        }, 1000);

        return () => clearInterval(interval);
    }, [playerIds, player1?.isPlaying, player2?.isPlaying, player3?.isPlaying, player4?.isPlaying]);

    //cooldown to join/rejoin game
    useEffect(() => {
        const interval = setInterval(() => {
            let player = getPlayer();
            if (!player) {
                return;
            }
            
            if (player.joinCooldown > 0) {
                player.joinCooldown = player.joinCooldown - 1;
                setPlayer(player);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [playerIds, player1, player2, player3, player4]);

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
                setPlayer(player);
            }
        }, 33);

        return () => clearInterval(interval);
    }, [playerIds, player1, player2, player3, player4]);

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

                setPlayer(player);
            }
            else if (!player.joinCooldown) {
                player.isPlaying = true;
                player.joinCooldown = 0;
                player.xPos = event.offsetX;
                player.yPos = event.offsetY;
                player.xVel = 0;
                player.yVel = 4;
                player.bounceCooldown = 0;

                setPlayer(player);
            }
        };

        canvas.addEventListener("click", handleClick);

        return () => {
            canvas.removeEventListener("click", handleClick);
        }
    }, [playerIds, player1, player2, player3, player4]);

    //draw all players' bubbles
    useEffect(() => {
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
                const bubbleImage = new Image(32, 32);
                bubbleImage.onload = () => {
                    context.drawImage(bubbleImage, player.xPos - 16, player.yPos - 16);
                };
                bubbleImage.src = "/bubble.png";

                if (player?.avatar) {
                    const avatarImage = new Image(24, 24);
                    avatarImage.onload = () => {
                        context.save();
                        context.globalAlpha = 0.5;
                        context.drawImage(avatarImage, player.xPos - 12, player.yPos - 12, 24, 24);
                        context.restore();
                    }
                    avatarImage.src = `https://cdn.discordapp.com/avatars/${player.id}/${player.avatar}`;
                }
            }
        }
    }, [playerIds, player1, player2, player3, player4]);

    useEffect(() => {
        let player = getPlayer();
        if (!player) {
            return;
        }

        if (player.xPos < 0 || player.xPos > 300 || player.yPos < 0 || player.yPos > 600) {
            setMessage("You died!");
            resetPlayer();
        }
    }, [playerIds, player1, player2, player3, player4]);

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
    }, [playerIds, player1, player2, player3, player4]);

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
                Player 1: {player1?.username}
            </div>
            <div>
                Player 2: {player2?.username}
            </div>
            <div>
                Player 3: {player3?.username}
            </div>
            <div>
                Player 4: {player4?.username}
            </div>
        </div>
    )
}