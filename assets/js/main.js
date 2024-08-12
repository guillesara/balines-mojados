window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("copyright").innerText = "© Copyright " +new Date().getFullYear() +". All Rights Reserved.";
    document.getElementById("signBtn").addEventListener("click", () => {
        document.getElementById("signForm").insertAdjacentHTML('beforeend', `
                <div class="bg2"></div>
                <form>
                    <button class="closeBtn">X</button>
                    <div class="title">
                        <h1>REGISTER</h1>
                    </div>
                    <div class="inputs">
                        <div class="element">
                            <h4>Usuario</h4>
                            <input type="text" name="username" />
                        </div>
                        <div class="element">
                            <h4>Usuario</h4>
                            <input type="password" name="password" />
                        </div>
                        <button class="signBtn">SIGN UP</button>
                    </div>
                </form>
            `);
    })
});

