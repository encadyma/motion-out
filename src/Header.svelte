<header>
    <h1>Motion Out!</h1>
    <nav>
        <div class="nav-item nav-item-active">👁️ View</div>
        <div class="nav-item">💃 Pose</div>
        <div class="nav-item">🖱️ Tweak</div>
        <div class="nav-item">🎭 Stage</div>
    </nav>
</header>

<style>
header {
    background: linear-gradient(to bottom, rgb(40, 40, 40), transparent);
    position: fixed;
    display: flex;
    color: rgba(255, 255, 255, 0.5);
    z-index: 99;
    padding: 20px 40px;
    align-items: center;
    width: 100vw;
    box-sizing: border-box;
}
h1 {
    margin: 0;
    padding: 0;
}

nav {
    display: flex;
    margin-left: 40px;
}

.nav-item {
    border-radius: 4px;
    padding: 8px 12px;
    margin: 0 5px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.6);
}

.nav-item:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.2);
}

.nav-item:active {
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.2);
}

.nav-item-active, .nav-item-active:hover {
    background: rgba(255, 255, 255, 0.4);
    color: rgba(255, 255, 255, 0.8);
    cursor: default;
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.2);
}
</style>