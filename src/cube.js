class Cube {
    constructor() {
        this.colors = ['#96ceb4', '#ffeead', '#FFB740', '#ff6f69', '#588c7e'];
        this.init();
    }

    init() {
        const geometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
        this.group = new THREE.Group();

        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                for (let z = 0; z < 10; z++) {
                    const index = Math.round(Math.random() * (this.colors.length - 1));
                    const cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: this.colors[index] }));
                    cube.color = this.colors[index];
                    cube.position.set(5 - x, 5 - y, 5 - z);
                    cube.castShadow = true;
                    cube.receiveShadow = true;
                    this.group.add(cube);
                }
            }
        }
    }

    update(elapsedTime) {
        this.group.rotation.x = Math.sin(elapsedTime / 4);
        this.group.rotation.y = Math.sin(elapsedTime / 2);

        this.group.children.forEach((cube) => {
            const { x, y, z } = cube.position;
            cube.rotation.y = Math.sin(x / 4 + elapsedTime) + Math.sin(y / 4 + elapsedTime) + Math.sin(z / 4 + elapsedTime);
            cube.rotation.z = cube.rotation.y * 2;
        });
    }

    handleHover(intersected) {
        this.group.children.forEach(mesh => {
            mesh.material.color.set(mesh.color);
            mesh.scale.set(1, 1, 1);
        })

        if (intersected) {
            intersected.material.color.set(0xFFFFFF);
            intersected.scale.set(2, 2, 2);
        }
    }
}


export default Cube;