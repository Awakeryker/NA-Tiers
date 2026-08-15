/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://gcoqlvjndhgqlukpgfqm.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_fBlhtxAmtqt5vP4PRe3nhQ_mNvfsjFh";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


/* =========================================================
   TIER POINTS
========================================================= */

const TIER_POINTS = {

    HT1: 60,
    LT1: 45,

    HT2: 30,
    LT2: 20,

    HT3: 10,
    LT3: 6,

    HT4: 4,
    LT4: 3,

    HT5: 2,
    LT5: 1

};


/* =========================================================
   GAMEMODES
========================================================= */

const GAMEMODES = [

    "Diamond SMP",
    "Sword",
    "Axe",
    "Neth SMP",
    "UHC",
    "Cart",
    "Spear & Mace",
    "Crystal"

];


/* =========================================================
   DATABASE COLUMN NAMES
========================================================= */

const MODE_COLUMNS = {

    "Diamond SMP": "diamond_smp",
    "Sword": "sword",
    "Axe": "axe",
    "Neth SMP": "neth_smp",
    "UHC": "uhc",
    "Cart": "cart",
    "Spear & Mace": "spear_mace",
    "Crystal": "crystal"

};


/* =========================================================
   GAMEMODE ICONS
========================================================= */

const MODE_ICONS = {

    "Diamond SMP": "💎",
    "Sword": "⚔️",
    "Axe": "🪓",
    "Neth SMP": "🔥",
    "UHC": "🥊",
    "Cart": "🛒",
    "Spear & Mace": "🔱",
    "Crystal": "💠"

};


function getModeIcon(mode) {

    return MODE_ICONS[mode] || "•";

}


/* =========================================================
   TESTER PASSWORD
========================================================= */

const TESTER_PASSWORD =
    "Sigmagoon23";


/* =========================================================
   PLAYER DATABASE
========================================================= */

let players = {};


/* =========================================================
   DOM ELEMENTS
========================================================= */

const rankingList =
    document.getElementById(
        "rankingList"
    );

const rankingTitle =
    document.getElementById(
        "rankingTitle"
    );

const currentCategory =
    document.getElementById(
        "currentCategory"
    );

const modeButtons =
    document.querySelectorAll(
        ".mode"
    );

const playerSearch =
    document.getElementById(
        "playerSearch"
    );

const searchResults =
    document.getElementById(
        "searchResults"
    );


/* =========================================================
   CURRENT GAMEMODE
========================================================= */

let currentMode =
    "Overall";


/* =========================================================
   CONVERT DATABASE ROW → WEBSITE PLAYER
========================================================= */

function databaseRowToPlayer(row) {

    const tiers = {};

    GAMEMODES.forEach(
        mode => {

            const column =
                MODE_COLUMNS[mode];

            tiers[mode] =
                row[column] || null;

        }
    );

    return {

        tiers: tiers

    };

}


/* =========================================================
   CONVERT WEBSITE PLAYER → DATABASE ROW
========================================================= */

function playerToDatabaseRow(
    username,
    player
) {

    const row = {

        username: username

    };

    GAMEMODES.forEach(
        mode => {

            const column =
                MODE_COLUMNS[mode];

            row[column] =
                player.tiers[mode] || null;

        }
    );

    return row;

}


/* =========================================================
   LOAD PLAYERS FROM SUPABASE
========================================================= */

async function loadPlayersFromDatabase() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("players")
                .select("*");


        if (error) {

            console.error(
                "Supabase load error:",
                error
            );

            return false;

        }


        players = {};


        data.forEach(
            row => {

                players[row.username] =
                    databaseRowToPlayer(
                        row
                    );

            }
        );


        return true;

    } catch (error) {

        console.error(
            "Could not connect to Supabase:",
            error
        );

        return false;

    }

}


/* =========================================================
   SAVE / UPDATE ONE PLAYER
========================================================= */

async function savePlayerToDatabase(
    username
) {

    const player =
        players[username];


    if (!player) {

        return false;

    }


    const row =
        playerToDatabaseRow(
            username,
            player
        );


    console.log(
        "Attempting to save player:",
        row
    );


    try {

        const {
            error
        } =
            await supabaseClient
                .from("players")
                .upsert(
                    row,
                    {
                        onConflict:
                            "username"
                    }
                );


        if (error) {

            console.error(
                "SUPABASE SAVE ERROR:",
                error
            );

            alert(
                "Supabase error:\n\n" +
                error.message +
                "\n\nCode: " +
                error.code
            );

            return false;

        }


        console.log(
            "Player saved successfully:",
            username
        );


        return true;

    } catch (error) {

        console.error(
            "SUPABASE SAVE ERROR:",
            error
        );

        alert(
            "Supabase error:\n\n" +
            error.message +
            "\n\nCode: " +
            (error.code || "Unknown")
        );

        return false;

    }

}


/* =========================================================
   DELETE PLAYER FROM DATABASE
========================================================= */

async function deletePlayerFromDatabase(
    username
) {

    try {

        const {
            error
        } =
            await supabaseClient
                .from("players")
                .delete()
                .eq(
                    "username",
                    username
                );


        if (error) {

            console.error(
                "Supabase delete error:",
                error
            );

            return false;

        }


        return true;

    } catch (error) {

        console.error(
            "Supabase delete error:",
            error
        );

        return false;

    }

}


/* =========================================================
   INITIAL SAMPLE DATA
========================================================= */

function createDefaultPlayers() {

    return {

        DreamExample: {

            tiers: {

                "Diamond SMP": "HT2",
                "Sword": "HT1",
                "Axe": "HT3",
                "Neth SMP": "LT2",
                "UHC": "HT3",
                "Cart": null,
                "Spear & Mace": "HT4",
                "Crystal": "LT1"

            }

        },


        SteveExample: {

            tiers: {

                "Diamond SMP": "HT3",
                "Sword": "LT1",
                "Axe": "HT2",
                "Neth SMP": null,
                "UHC": "HT4",
                "Cart": "LT3",
                "Spear & Mace": null,
                "Crystal": "HT3"

            }

        },


        AlexExample: {

            tiers: {

                "Diamond SMP": "LT2",
                "Sword": "HT3",
                "Axe": null,
                "Neth SMP": "HT3",
                "UHC": "LT2",
                "Cart": null,
                "Spear & Mace": "LT3",
                "Crystal": null

            }

        }

    };

}


/* =========================================================
   SEED DATABASE IF EMPTY
========================================================= */

async function seedDatabaseIfEmpty() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("players")
            .select("username")
            .limit(1);


    if (error) {

        console.error(
            "Could not check database:",
            error
        );

        return;

    }


    if (
        data &&
        data.length > 0
    ) {

        return;

    }


    players =
        createDefaultPlayers();


    for (
        const username of
        Object.keys(players)
    ) {

        await savePlayerToDatabase(
            username
        );

    }

}


/* =========================================================
   CALCULATE PLAYER POINTS
========================================================= */

function getPlayerPoints(player) {

    let total = 0;


    if (
        !player ||
        !player.tiers
    ) {

        return 0;

    }


    for (
        const mode of GAMEMODES
    ) {

        const tier =
            player.tiers[mode];


        if (
            tier &&
            TIER_POINTS[tier]
        ) {

            total +=
                TIER_POINTS[tier];

        }

    }


    return total;

}


/* =========================================================
   GET PLAYER TIERS
========================================================= */

function getPlayerTierArray(
    player
) {

    const tiers = [];


    for (
        const mode of GAMEMODES
    ) {

        const tier =
            player.tiers[mode];


        if (tier) {

            tiers.push({

                mode: mode,
                tier: tier

            });

        }

    }


    return tiers;

}


/* =========================================================
   TIER CSS CLASS
========================================================= */

function tierClass(tier) {

    if (!tier) {

        return "";

    }


    return (
        "tier-" +
        tier.toLowerCase()
    );

}


/* =========================================================
   CREATE TIER BADGE
========================================================= */

function createTierBadge(
    tier
) {

    if (!tier) {

        return `

            <span class="untested">
                —
            </span>

        `;

    }


    return `

        <span class="tier ${tierClass(tier)}">

            ${tier}

        </span>

    `;

}


/* =========================================================
   OVERALL RANKINGS
========================================================= */

function getOverallRankings() {

    return Object.entries(players)

        .map(
            ([username, player]) => {

                return {

                    username:
                        username,

                    points:
                        getPlayerPoints(
                            player
                        ),

                    tiers:
                        getPlayerTierArray(
                            player
                        )

                };

            }
        )

        .sort(
            (a, b) => {

                if (
                    b.points !==
                    a.points
                ) {

                    return (
                        b.points -
                        a.points
                    );

                }


                return a.username.localeCompare(
                    b.username
                );

            }
        );

}


/* =========================================================
   GAMEMODE RANKINGS
========================================================= */

function getGamemodeRankings(
    mode
) {

    return Object.entries(players)

        .map(
            ([username, player]) => {

                const tier =
                    player.tiers[mode];


                return {

                    username:
                        username,

                    tier:
                        tier,

                    points:
                        tier
                            ? TIER_POINTS[tier]
                            : 0

                };

            }
        )

        .filter(
            player =>
                player.tier
        )

        .sort(
            (a, b) => {

                if (
                    b.points !==
                    a.points
                ) {

                    return (
                        b.points -
                        a.points
                    );

                }


                return a.username.localeCompare(
                    b.username
                );

            }
        );

}


/* =========================================================
   TIE RANKING
========================================================= */

function getRank(
    index,
    rankings
) {

    if (index === 0) {

        return 1;

    }


    const current =
        rankings[index].points;

    const previous =
        rankings[index - 1].points;


    if (
        current ===
        previous
    ) {

        return getRank(
            index - 1,
            rankings
        );

    }


    return index + 1;

}


/* =========================================================
   TOP 3 COLORS
========================================================= */

function getRankClass(
    rank
) {

    if (rank === 1) {

        return "rank-gold";

    }

    if (rank === 2) {

        return "rank-silver";

    }

    if (rank === 3) {

        return "rank-bronze";

    }

    return "";

}


/* =========================================================
   OVERALL DISPLAY
========================================================= */

function renderOverall() {

    const rankings =
        getOverallRankings();


    rankingTitle.textContent =
        "Overall Rankings";


    currentCategory.textContent =
        "OVERALL";


    if (
        rankings.length === 0
    ) {

        rankingList.innerHTML = `

            <div class="empty">

                No players have been
                added yet.

            </div>

        `;

        return;

    }


    let html = `

        <div class="ranking-row header">

            <div>#</div>

            <div>Player</div>

            <div>Points</div>

            <div>Rankings</div>

        </div>

    `;


    rankings.forEach(
        (player, index) => {

            const rank =
                getRank(
                    index,
                    rankings
                );


            const rankClass =
                getRankClass(
                    rank
                );


            const tierHTML =
                player.tiers

                    .map(
                        item => `

                            <span
                                class="tier-with-mode"
                            >

                                <span
                                    class="mode-name"
                                >

                                    ${getModeIcon(
                                        item.mode
                                    )}

                                    ${item.mode}

                                </span>

                                ${createTierBadge(
                                    item.tier
                                )}

                            </span>

                        `
                    )

                    .join("");


            html += `

                <div class="ranking-row">

                    <div
                        class="position ${rankClass}"
                    >
                        ${rank}
                    </div>


                    <div
                        class="player-name ${rankClass}"
                        onclick="openProfile('${escapeHTML(
                            player.username
                        )}')"
                    >
                        ${escapeHTML(
                            player.username
                        )}
                    </div>


                    <div class="points">
                        ${player.points}
                    </div>


                    <div class="tier-list">
                        ${tierHTML}
                    </div>

                </div>

            `;

        }
    );


    rankingList.innerHTML =
        html;

}


/* =========================================================
   GAMEMODE DISPLAY
========================================================= */

function renderGamemode(
    mode
) {

    const rankings =
        getGamemodeRankings(
            mode
        );


    rankingTitle.textContent =
        mode + " Rankings";


    currentCategory.textContent =
        mode.toUpperCase();


    if (
        rankings.length === 0
    ) {

        rankingList.innerHTML = `

            <div class="empty">

                No players have been
                tested in this gamemode yet.

            </div>

        `;

        return;

    }


    let html = `

        <div class="ranking-row header">

            <div>#</div>

            <div>Player</div>

            <div>Tier</div>

            <div>Points</div>

        </div>

    `;


    rankings.forEach(
        (player, index) => {

            const rank =
                getRank(
                    index,
                    rankings
                );


            html += `

                <div class="ranking-row">

                    <div class="position">
                        ${rank}
                    </div>


                    <div
                        class="player-name"
                        onclick="openProfile('${escapeHTML(
                            player.username
                        )}')"
                    >
                        ${escapeHTML(
                            player.username
                        )}
                    </div>


                    <div>
                        ${createTierBadge(
                            player.tier
                        )}
                    </div>


                    <div class="points">
                        ${player.points}
                    </div>

                </div>

            `;

        }
    );


    rankingList.innerHTML =
        html;

}


/* =========================================================
   RENDER CURRENT MODE
========================================================= */

function renderMode() {

    if (
        currentMode ===
        "Overall"
    ) {

        renderOverall();

    } else {

        renderGamemode(
            currentMode
        );

    }

}


/* =========================================================
   GAMEMODE BUTTONS
========================================================= */

modeButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                if (
                    button.id ===
                    "editButton"
                ) {

                    return;

                }


                modeButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentMode =
                    button.dataset.mode;


                renderMode();

            }
        );

    }
);


/* =========================================================
   PLAYER PROFILE
========================================================= */

const profileOverlay =
    document.getElementById(
        "profileOverlay"
    );

const profileName =
    document.getElementById(
        "profileName"
    );

const profilePoints =
    document.getElementById(
        "profilePoints"
    );

const profileAvatar =
    document.getElementById(
        "profileAvatar"
    );

const profileTiers =
    document.getElementById(
        "profileTiers"
    );


function openProfile(
    username
) {

    const player =
        players[username];


    if (!player) {

        return;

    }


    profileName.textContent =
        username;


    profilePoints.textContent =
        "Overall: " +
        getPlayerPoints(
            player
        ) +
        " points";


    profileAvatar.src =
        "https://mc-heads.net/avatar/" +
        encodeURIComponent(
            username
        ) +
        "/96";


    let html = "";


    GAMEMODES.forEach(
        mode => {

            const tier =
                player.tiers[mode];


            html += `

                <div class="profile-tier">

                    <span>

                        ${getModeIcon(
                            mode
                        )}

                        ${mode}

                    </span>


                    ${
                        tier

                        ? createTierBadge(
                            tier
                        )

                        : `
                            <span
                                class="untested"
                            >
                                —
                            </span>
                        `
                    }

                </div>

            `;

        }
    );


    profileTiers.innerHTML =
        html;


    profileOverlay.classList.remove(
        "hidden"
    );

}


window.openProfile =
    openProfile;


/* =========================================================
   CLOSE PROFILE
========================================================= */

document
    .getElementById(
        "closeProfile"
    )
    .addEventListener(
        "click",
        () => {

            profileOverlay.classList.add(
                "hidden"
            );

        }
    );


profileOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            profileOverlay
        ) {

            profileOverlay.classList.add(
                "hidden"
            );

        }

    }
);


/* =========================================================
   SEARCH
========================================================= */

playerSearch.addEventListener(
    "input",
    () => {

        const query =
            playerSearch.value
                .trim()
                .toLowerCase();


        searchResults.innerHTML =
            "";


        if (!query) {

            searchResults.style.display =
                "none";

            return;

        }


        const matches =
            Object.keys(players)

                .filter(
                    username =>
                        username
                            .toLowerCase()
                            .includes(
                                query
                            )
                )

                .slice(0, 8);


        if (
            matches.length === 0
        ) {

            searchResults.innerHTML = `

                <div class="search-result">
                    No players found.
                </div>

            `;

        } else {

            matches.forEach(
                username => {

                    const result =
                        document.createElement(
                            "div"
                        );


                    result.className =
                        "search-result";


                    result.textContent =
                        username;


                    result.addEventListener(
                        "click",
                        () => {

                            openProfile(
                                username
                            );


                            playerSearch.value =
                                "";


                            searchResults.style.display =
                                "none";

                        }
                    );


                    searchResults.appendChild(
                        result
                    );

                }
            );

        }


        searchResults.style.display =
            "block";

    }
);


/* =========================================================
   CLOSE SEARCH
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            !event.target.closest(
                ".search-container"
            )
        ) {

            searchResults.style.display =
                "none";

        }

    }
);


/* =========================================================
   EDIT LOGIN
========================================================= */

const loginOverlay =
    document.getElementById(
        "loginOverlay"
    );

const editorOverlay =
    document.getElementById(
        "editorOverlay"
    );


document
    .getElementById(
        "editButton"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "testerPassword"
                )
                .value = "";


            document
                .getElementById(
                    "loginMessage"
                )
                .textContent = "";


            loginOverlay.classList.remove(
                "hidden"
            );

        }
    );


document
    .getElementById(
        "closeLogin"
    )
    .addEventListener(
        "click",
        () => {

            loginOverlay.classList.add(
                "hidden"
            );

        }
    );


document
    .getElementById(
        "loginButton"
    )
    .addEventListener(
        "click",
        loginTester
    );


document
    .getElementById(
        "testerPassword"
    )
    .addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                loginTester();

            }

        }
    );


function loginTester() {

    const password =
        document
            .getElementById(
                "testerPassword"
            )
            .value;


    const message =
        document.getElementById(
            "loginMessage"
        );


    if (
        password ===
        TESTER_PASSWORD
    ) {

        loginOverlay.classList.add(
            "hidden"
        );


        editorOverlay.classList.remove(
            "hidden"
        );


        message.textContent =
            "";

    } else {

        message.textContent =
            "Incorrect password.";


        message.style.color =
            "#ff7777";

    }

}


/* =========================================================
   CLOSE EDITOR
========================================================= */

document
    .getElementById(
        "closeEditor"
    )
    .addEventListener(
        "click",
        () => {

            editorOverlay.classList.add(
                "hidden"
            );

        }
    );


/* =========================================================
   SAVE / EDIT TIER
========================================================= */

document
    .getElementById(
        "saveTier"
    )
    .addEventListener(
        "click",
        saveTier
    );


async function saveTier() {

    const username =
        document
            .getElementById(
                "editUsername"
            )
            .value
            .trim();


    const gamemode =
        document
            .getElementById(
                "editGamemode"
            )
            .value;


    const tier =
        document
            .getElementById(
                "editTier"
            )
            .value;


    const message =
        document
            .getElementById(
                "saveMessage"
            );


    if (!username) {

        message.textContent =
            "Enter a Minecraft username.";


        message.style.color =
            "#ff7777";


        return;

    }


    /* Create player if needed */

    if (
        !players[username]
    ) {

        players[username] = {

            tiers: {}

        };

    }


    /* Make sure all gamemodes exist */

    GAMEMODES.forEach(
        mode => {

            if (
                !(mode in
                    players[username].tiers)
            ) {

                players[username]
                    .tiers[mode] =
                    null;

            }

        }
    );


    /* Set or remove tier */

    if (
        tier ===
        "UNTESTED"
    ) {

        players[username]
            .tiers[gamemode] =
            null;

    } else {

        players[username]
            .tiers[gamemode] =
            tier;

    }


    message.textContent =
        "Saving...";

    message.style.color =
        "#ffffff";


    const success =
        await savePlayerToDatabase(
            username
        );


    if (!success) {

        message.textContent =
            "Could not save to database.";

        message.style.color =
            "#ff7777";

        return;

    }


    message.textContent =
        username +
        "'s " +
        gamemode +
        " ranking was updated.";

    message.style.color =
        "#7ee2a8";


    renderMode();

}


/* =========================================================
   DELETE PLAYER
========================================================= */

function addDeleteButton() {

    const saveButton =
        document.getElementById(
            "saveTier"
        );


    if (!saveButton) {

        return;

    }


    if (
        document.getElementById(
            "deletePlayer"
        )
    ) {

        return;

    }


    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.id =
        "deletePlayer";


    deleteButton.textContent =
        "Delete Player";


    deleteButton.style.marginTop =
        "10px";


    deleteButton.style.background =
        "#7a2525";


    deleteButton.style.color =
        "white";


    deleteButton.style.border =
        "none";


    deleteButton.style.padding =
        "10px 16px";


    deleteButton.style.cursor =
        "pointer";


    saveButton.parentElement.appendChild(
        deleteButton
    );


    deleteButton.addEventListener(
        "click",
        deletePlayer
    );

}


async function deletePlayer() {

    const username =
        document
            .getElementById(
                "editUsername"
            )
            .value
            .trim();


    const message =
        document
            .getElementById(
                "saveMessage"
            );


    if (!username) {

        message.textContent =
            "Enter the username of the player to delete.";

        message.style.color =
            "#ff7777";

        return;

    }


    if (
        !players[username]
    ) {

        message.textContent =
            "That player does not exist.";

        message.style.color =
            "#ff7777";

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete " +
            username +
            " from NA Tiers?"
        );


    if (!confirmed) {

        return;

    }


    message.textContent =
        "Deleting...";


    const success =
        await deletePlayerFromDatabase(
            username
        );


    if (!success) {

        message.textContent =
            "Could not delete player.";

        message.style.color =
            "#ff7777";

        return;

    }


    delete players[username];


    message.textContent =
        username +
        " was deleted.";

    message.style.color =
        "#7ee2a8";


    renderMode();

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================================================
   REALTIME DATABASE UPDATES
========================================================= */

function startRealtimeUpdates() {

    supabaseClient
        .channel(
            "na-tiers-live"
        )
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "players"
            },
            async () => {

                console.log(
                    "NA Tiers database changed. Reloading..."
                );


                await loadPlayersFromDatabase();


                renderMode();

            }
        )
        .subscribe(
            status => {

                console.log(
                    "Realtime status:",
                    status
                );

            }
        );

}


/* =========================================================
   INITIALIZE
========================================================= */

async function initializeNATiers() {

    const loaded =
        await loadPlayersFromDatabase();


    if (!loaded) {

        console.error(
            "NA Tiers could not connect to Supabase."
        );

        return;

    }


    /*
       If database is empty, put the
       example players into it.
    */

    if (
        Object.keys(players).length === 0
    ) {

        await seedDatabaseIfEmpty();

        await loadPlayersFromDatabase();

    }


    renderMode();


    addDeleteButton();


    startRealtimeUpdates();

}


/* =========================================================
   START WEBSITE
========================================================= */

initializeNATiers();
