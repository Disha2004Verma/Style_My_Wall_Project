const apiToken = "818080c0f19597d5030fcf950ada061716bf94a582ab8cc5bac9644ba3e4ac6d";

		async function generateImage() {
			const prompt = document.getElementById('prompt').value;

			try {
				const generatedImage = document.getElementById('generatedImage'); // Final Image URL
				generatedImage.src = "https://bestanimations.com/Animals/Mammals/Cats/cats/cute-kitty-animated-gif-2.gif";
				generatedImage.style.width = '10%';
				generatedImage.style.margin = '10px';
				// Call the image generate API
				const generateResponse = await fetch('https://api.picogen.io/v1/job/generate', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'API-Token': apiToken
					},
					body: JSON.stringify({
						prompt: prompt,
						ratio: "16:9",
						resolution: "2k",
						steps: 20,
						guidance: 4.5
					})
				});

				const generateData = await generateResponse.json();
				const jobId = generateData[1].id; //IMAGE_TEXT

				let imageUrl = '';
				while (!imageUrl) {
					// Call the get API
					const getResponse = await fetch(`https://api.picogen.io/v1/job/get/${jobId}`, {
						method: 'GET',
						headers: {
							'API-Token': apiToken
						}
					});

					const getData = await getResponse.json();

					if (getData[1].status === 'completed') {
						imageUrl = getData[1].result; // Image URL
					} else {
						// Wait for 4 seconds before the next image fetching
						await new Promise(resolve => setTimeout(resolve, 4000));
					}
				}

				// Display the image                
				generatedImage.src = imageUrl;
				generatedImage.style.width = '45%';
				generatedImage.style.margin = '30px 0';


			} catch (error) {
				console.error('Error generating image:', error);
			}
		}

		async function fetchGeneratedImages() {
			try {
				const response = await axios.get('https://api.picogen.io/v1/job/list', {
					headers: {
						'API-Token': apiToken
					},
					params: {
						page: 1,
						limit: 10
					}
				});

				const images = response.data[1];
				const imageGrid = document.getElementById('imageGrid');
				imageGrid.innerHTML = '';

				images.forEach(image => {
					if (image.status === 'completed') {
						const imageCard = document.createElement('div');
						imageCard.className = 'image-card';
						imageCard.innerHTML = `
                            <img src="${image.result}" alt="${image.payload.prompt}">
                            <p>${image.payload.prompt}<span><img style="margin-left: 80%; width: 15%;" src="https://www.freeiconspng.com/uploads/white-download-icon-png-32.png" alt="Download AR Model" onclick="downloadModel('${image.result}')"></span></p>
                        `;
						imageGrid.appendChild(imageCard);
					}
				});
			} catch (error) {
				console.error('Error:', error);
			}
		}

		fetchGeneratedImages();

		async function fetchImageAsBase64(url) {
			const corsProxy = 'https://cors-anywhere.herokuapp.com/';
			const response = await fetch(corsProxy + url);
			const blob = await response.blob();
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result);
				reader.onerror = reject;
				reader.readAsDataURL(blob);
			});
		}

		async function updateGLTFWithBase64Image(gltfContent, imageUrl) {
			const base64Image = await fetchImageAsBase64(imageUrl);
			const gltf = JSON.parse(gltfContent);
			gltf.images[0].uri = base64Image;
			return JSON.stringify(gltf);
		}

		function saveBase64ToFile(base64, filename) {
			const link = document.createElement('a');
			link.href = base64;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}

		async function downloadModel(imageUrl) {
			const gltfContent = `{
  "asset": {
    "version": "2.0",
    "generator": "THREE.GLTFExporter r167"
  },
  "scenes": [
    {
      "name": "Scene",
      "nodes": [
        0
      ]
    }
  ],
  "scene": 0,
  "nodes": [
    {
      "matrix": [
        -1,
        1.2246467991473532e-16,
        0,
        0,
        -1.2246467991473532e-16,
        -1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      ],
      "name": "Plane",
      "mesh": 0
    }
  ],
  "bufferViews": [
    {
      "buffer": 0,
      "byteOffset": 0,
      "byteLength": 48,
      "target": 34962,
      "byteStride": 12
    },
    {
      "buffer": 0,
      "byteOffset": 48,
      "byteLength": 48,
      "target": 34962,
      "byteStride": 12
    },
    {
      "buffer": 0,
      "byteOffset": 96,
      "byteLength": 32,
      "target": 34962,
      "byteStride": 8
    },
    {
      "buffer": 0,
      "byteOffset": 128,
      "byteLength": 12,
      "target": 34963
    }
  ],
  "buffers": [
    {
      "byteLength": 140,
      "uri": "data:application/octet-stream;base64,AAAAwQAAkEAAAAAAAAAAQQAAkEAAAAAAAAAAwQAAkMAAAAAAAAAAQQAAkMAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAgD8AAIA/AACAPwAAAAAAAAAAAACAPwAAAAAAAAIAAQACAAMAAQA="
    }
  ],
  "accessors": [
    {
      "bufferView": 0,
      "componentType": 5126,
      "count": 4,
      "max": [
        8,
        4.5,
        0
      ],
      "min": [
        -8,
        -4.5,
        0
      ],
      "type": "VEC3"
    },
    {
      "bufferView": 1,
      "componentType": 5126,
      "count": 4,
      "max": [
        0,
        0,
        1
      ],
      "min": [
        0,
        0,
        1
      ],
      "type": "VEC3"
    },
    {
      "bufferView": 2,
      "componentType": 5126,
      "count": 4,
      "max": [
        1,
        1
      ],
      "min": [
        0,
        0
      ],
      "type": "VEC2"
    },
    {
      "bufferView": 3,
      "componentType": 5123,
      "count": 6,
      "max": [
        3
      ],
      "min": [
        0
      ],
      "type": "SCALAR"
    }
  ],
  "materials": [
    {
      "pbrMetallicRoughness": {
        "baseColorFactor": [
          0.913098651791473,
          0.913098651791473,
          0.913098651791473,
          1
        ],
        "metallicFactor": 0,
        "roughnessFactor": 0.9,
        "baseColorTexture": {
          "index": 0,
          "texCoord": 0
        }
      },
      "extensions": {
        "KHR_materials_unlit": {}
      }
    }
  ],
  "textures": [
    {
      "sampler": 0,
      "source": 0
    }
  ],
  "samplers": [
    {
      "magFilter": 9729,
      "minFilter": 9987,
      "wrapS": 33071,
      "wrapT": 33071
    }
  ],
  "images": [
    {
      "mimeType": "image/png",
      "uri": ""
    }
  ],
  "meshes": [
    {
      "primitives": [
        {
          "mode": 4,
          "attributes": {
            "POSITION": 0,
            "NORMAL": 1,
            "TEXCOORD_0": 2
          },
          "indices": 3,
          "material": 0
        }
      ]
    }
  ],
  "extensionsUsed": [
    "KHR_materials_unlit"
  ]
}`;

			const updatedGLTFContent = await updateGLTFWithBase64Image(gltfContent, imageUrl);

			// Save the updated GLTF content to a file
			saveBase64ToFile('data:application/json;base64,' + btoa(updatedGLTFContent), 'scene.gltf');

			// Create a Blob from the updated GLTF content
			const blob = new Blob([updatedGLTFContent], {type: 'application/json'});
		}