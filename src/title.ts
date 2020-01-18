const title: string = `npmb💣mb`;

export function setPackageTitle(pkg: string): void {
    window.document.title = pkg ? `${title} - ${pkg}` : title;
}

export function setDefaultTitle() {
    window.document.title = `${title} - Guess NPM dependencies`;
}
