document.addEventListener('DOMContentLoaded', () => {
    const asetukset = document.getElementById('asetukset');
    const peli = document.getElementById('peli');
    const aloitaPeliButton = document.getElementById('aloitaPeli');
    const heitäNoppaButton = document.getElementById('heitäNoppa');
    const pidäButton = document.getElementById('pidä');
    const nollaaPeliButton = document.getElementById('nollaaPeli');
    const pelaajaVuoroDiv = document.getElementById('pelaajaVuoro');
    const noppa1Img = document.getElementById('noppa1');
    const noppa2Img = document.getElementById('noppa2');
    const pisteetDiv = document.getElementById('pisteet');
    const pelaajaLkmInput = document.getElementById('pelaajaLkm');
    const pelaajaNimetDiv = document.getElementById('pelaajaNimet');
    const peliVersioRadios = document.querySelectorAll('input[name="peliTyyppi"]');
    const sääntöjenNäyttöButton = document.getElementById('näytäSäännöt');
    const sääntöjenModal = document.getElementById('säännötModal');
    const closeModalButton = document.querySelector('.close');
    const virheviestiDiv = document.getElementById('virheviestit');

    let pelaajat = [];
    let nykyinenPelaaja = 0;
    let nykyinenPisteet = 0;
    let peliAktiivinen = false;
    let kahdenNopanPeli = false;

    sääntöjenNäyttöButton.addEventListener('click', () => {
        sääntöjenModal.style.display = 'block';
    });

    closeModalButton.addEventListener('click', () => {
        sääntöjenModal.style.display = 'none';
    });

    pelaajaLkmInput.addEventListener('change', päivitäPelaajaSyötteet);
    aloitaPeliButton.addEventListener('click', aloitaPeli);
    heitäNoppaButton.addEventListener('click', heitäNoppa);
    pidäButton.addEventListener('click', pidä);
    nollaaPeliButton.addEventListener('click', nollaaPeli);

    function päivitäPelaajaSyötteet() {
        pelaajaNimetDiv.innerHTML = '';
        for (let i = 0; i < pelaajaLkmInput.value; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Pelaaja ${i + 1} nimi`;
            input.className = 'pelaaja-nimi';
            pelaajaNimetDiv.appendChild(input);
        }
    }

    function aloitaPeli() {
        pelaajat = [];
        const nimiSyötteet = document.querySelectorAll('.pelaaja-nimi');
        const virheviestiDiv = document.getElementById('virheviestit');
        virheviestiDiv.innerHTML = ''; // Clear any existing error messages
    
        let isValid = true;
    
        nimiSyötteet.forEach(input => {
            const playerName = input.value.trim();
            const virheviesti = document.createElement('p');
            virheviesti.classList.add('virheviesti');
            virheviesti.setAttribute('role', 'alert');
    
            if (playerName.length === 0 || playerName.length < 3) {
                isValid = false;
                input.classList.add('invalid');
                virheviesti.textContent = 'Pelaajan nimen tulee olla vähintään 3 merkkiä pitkä.';
                virheviestiDiv.appendChild(virheviesti); // Append error message to container
            } else {
                input.classList.remove('invalid');
                pelaajat.push({ nimi: playerName, pisteet: 0 });
            }
        });
    
        if (!isValid) {
            // Stop game initialization if any player name is invalid
            return;
        }
    
        // Clear input field errors after successful validation
        nimiSyötteet.forEach(input => {
            input.classList.remove('invalid');
        });
    
        // Clear any existing error messages again after validation
        virheviestiDiv.innerHTML = '';
    
        peliVersioRadios.forEach(radio => {
            if (radio.checked) {
                kahdenNopanPeli = radio.value === 'kaksiNoppaa';
            }
        });
    
        nykyinenPelaaja = 0;
        nykyinenPisteet = 0;
        peliAktiivinen = true;
        asetukset.style.display = 'none';
        peli.style.display = 'block';
        päivitäPisteet();
        päivitäPelaajaVuoro();
    }
    
    
    
    
    

    function heitäNoppa() {
        if (!peliAktiivinen) return;
        let noppa1 = Math.floor(Math.random() * 6) + 1;
        let noppa2 = kahdenNopanPeli ? Math.floor(Math.random() * 6) + 1 : null;
        noppa1Img.src = `images/noppa${noppa1}.png`;
        noppa1Img.style.display = 'block';
        if (noppa2 !== null) {
            noppa2Img.src = `images/noppa${noppa2}.png`;
            noppa2Img.style.display = 'block';
        } else {
            noppa2Img.style.display = 'none';
        }

        if (kahdenNopanPeli) {
            käsitteleKaksiNoppaaHeitto(noppa1, noppa2);
        } else {
            käsitteleYksiNoppaHeitto(noppa1);
        }
    }

    function käsitteleYksiNoppaHeitto(noppa) {
        if (noppa === 1) {
            nykyinenPisteet = 0;
            vaihdaPelaajaa();
        } else {
            nykyinenPisteet += noppa;
        }
        päivitäPelaajaVuoro();
    }

    function käsitteleKaksiNoppaaHeitto(noppa1, noppa2) {
        if (noppa1 === 1 && noppa2 === 1) {
            nykyinenPisteet += 25; // Add 25 to the current turn's points
        } else if (noppa1 === 1 || noppa2 === 1) {
            nykyinenPisteet = 0;
            vaihdaPelaajaa();
        } else if (noppa1 === noppa2) {
            nykyinenPisteet += (noppa1 + noppa2);
        } else {
            nykyinenPisteet += noppa1 + noppa2;
        }
        päivitäPelaajaVuoro();
    }


    function pidä() {
        if (!peliAktiivinen) return;
        pelaajat[nykyinenPelaaja].pisteet += nykyinenPisteet;
        nykyinenPisteet = 0;
        if (pelaajat[nykyinenPelaaja].pisteet >= 100) {
            alert(`${pelaajat[nykyinenPelaaja].nimi} voittaa!`);
            peliAktiivinen = false;
        } else {
            vaihdaPelaajaa();
        }
        päivitäPisteet();
    }

    function nollaaPeli() {
        asetukset.style.display = 'block';
        peli.style.display = 'none';
        peliAktiivinen = false;
        päivitäPelaajaSyötteet();
    }

    function vaihdaPelaajaa() {
        nykyinenPelaaja = (nykyinenPelaaja + 1) % pelaajat.length;
        päivitäPelaajaVuoro();
    }

    function päivitäPelaajaVuoro() {
        pelaajaVuoroDiv.innerHTML = `Vuorossa: ${pelaajat[nykyinenPelaaja].nimi} (Nykyiset pisteet: ${nykyinenPisteet})`;
    }

    function päivitäPisteet() {
        pisteetDiv.innerHTML = '<h3>Pisteet</h3>';
        pelaajat.forEach(pelaaja => {
            pisteetDiv.innerHTML += `<p>${pelaaja.nimi}: ${pelaaja.pisteet}</p>`;
        });
    }

    päivitäPelaajaSyötteet();
});
