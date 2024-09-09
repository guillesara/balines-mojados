for (let x of reserves) {
    const date = new Date(x.date).toLocaleDateString('es-AR');
    const html = 
    `<tr>
        <td>${x.id}</td>
        <td><p>${x.name} ${x.lastname}</p></td>
        <td>${date}</td>
        <td>${x.time}</td>
        <td><a href="/admin/reserves/view/${x.id}"><i class='bx bx-edit'></i></a></td>
    </tr> `;

    document.getElementById("reserves").insertAdjacentHTML('beforeend', html);
}