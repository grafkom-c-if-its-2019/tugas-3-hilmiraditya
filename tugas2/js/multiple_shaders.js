(function(global) {

    var canvas, gl, shaders = [], points = [],// program
      mode = 0;   // current shader
  
    glUtils.SL.init({ callback:function() { main(); } });
  
    function main() {
      // Get canvas element and check if WebGL enabled
      canvas = document.getElementById("glcanvas");
      gl = glUtils.checkWebGL(canvas);
  
      initShaders();
      initCallbacks();
  
    }
  
    function initShaders() {
      var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
          fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
      var vertexShader2 = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v2.vertex),
          fragmentShader2 = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v2.fragment);
  
      shaders.push(glUtils.createProgram(gl, vertexShader, fragmentShader));
      shaders.push(glUtils.createProgram(gl, vertexShader2, fragmentShader2));

    }

    function initCallbacks(){
        window.addEventListener('resize', resizer);
        resizer();
    }

    function initBuffersTriangle() {
        var vertices = new Float32Array([  

          +0.1, +0.8, 0.1, 2.0, 0.6,
          +0.1, -0.6, 0.1, 3.0, 0.3,
          +0.2, -0.6, 0.1, 5.0, 0.5,
    
          +0.1, +0.8, 1.0, 1.0, 0.3,
          +0.2, +0.8, 0.9, 0.9, 0.2,
          +0.2, -0.6, 0.8, 1.0, 0.1,
    
          +0.2, +0.2, 10.1, 1.0, 0.6,
          +0.2, 0.0, 10.1, 1.0, 0.6,
          +0.4, 0.0, 10.1, 1.0, 0.6,
    
          +0.2, +0.2, 10.1, 1.0, 0.6,
          +0.4, +0.2, 10.1, 1.0, 0.6,
          +0.4, 0.0, 10.1, 1.0, 0.6,
    
          +0.4, +0.8, 10.1, 1.0, 0.6,
          +0.4, -0.6, 10.1, 1.0, 0.6,
          +0.5, -0.6, 10.1, 1.0, 0.6,
    
          +0.4, +0.8, 10.1, 1.0, 0.6,
          +0.5, +0.8, 10.1, 1.0, 0.6,
          +0.5, -0.6, 10.1, 1.0, 0.6,
        ]);
        // The number of vertices
   
        // var n = 21;
        var n = 18;
    
        // Create a buffer object
        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
          console.log('Failed to create the buffer object');
          return -1;
        }
   
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        gl.bufferData(gl.ARRAY_BUFFER,  new Float32Array(vertices), gl.STATIC_DRAW);

        var program = shaders[0];
        
        var aPosition = gl.getAttribLocation(program, 'aPosition');
        var vColor = gl.getAttribLocation(program, 'vColor');
        
        if (aPosition < 0) {
          console.log('Failed to get the storage location of aPosition');
          return -1;
        }

        gl.vertexAttribPointer(
            aPosition , 2 , gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT , 0
        );
      
        gl.vertexAttribPointer(
            vColor , 3 , gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT , 2 * Float32Array.BYTES_PER_ELEMENT
        );
    
        gl.enableVertexAttribArray(aPosition);
        gl.enableVertexAttribArray(vColor);
    
        return n;
    }

    function initBuffersLine() {
        var vertices = new Float32Array([
          -0.2, -0.6,
          -0.1, -0.6,
          -0.1, 0.0,
          +0.1, 0.0,
          +0.1, -0.6,
          +0.2, -0.6,
          +0.2, +0.8,
          +0.1, +0.8,
          +0.1, +0.2,
          -0.1, +0.2,
          -0.1, +0.8,
          -0.2, +0.8,
        ]);
        // The number of vertices
        var n = 12;
    
        // Create a buffer object
        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
          console.log('Failed to create the buffer object');
          return -1;
        }
    
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
        var program = shaders[1];
        var aPosition = gl.getAttribLocation(program, 'aPosition');
        if (aPosition < 0) {
          console.log('Failed to get the storage location of aPosition');
          return -1;
        }
    
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    
        gl.enableVertexAttribArray(aPosition);
    
        return n;
    }

    function draw(){
    
        var program1 = shaders[1];
        var theta = 0;
        var program2 = shaders[0]
        var scale = 0;
        var isGrow = 1;
        var theta2 = 0
        
        function render(){

            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            
            gl.useProgram(program1);
            var thetaLoc = gl.getUniformLocation(program1,'theta');
    
            var n = initBuffersLine(gl);
            if (n < 0) {
                console.log('Failed to set the positions of the vertices');
                return;
            }
            thetaLoc = gl.getUniformLocation(program1,'theta');

            theta += Math.PI * 0.0164;
            gl.uniform1f(thetaLoc, theta);

          
            gl.drawArrays(gl.LINE_LOOP,0,n); 

            gl.useProgram(program2);
            var n = initBuffersTriangle(gl);
            if (n < 0) {
                console.log('Failed to set the positions of the vertices');
                return;
            }

            var scaleLoc = gl.getUniformLocation(program2,'scale');
            var theta2Loc = gl.getUniformLocation(program2,'theta2');

            theta2 += Math.PI * 0.0164;
            gl.uniform1f(theta2Loc, theta2);

            if(isGrow) {scale += 0.0164}
            else{
                scale -= 0.0164;
            }
        
            if(scale >= 1.0) {isGrow = 0;}
            else if(scale <= -(1.0)){isGrow =1;}
            gl.uniform1f(scaleLoc, scale);
        
            gl.drawArrays(gl.TRIANGLES,0,n);

            requestAnimationFrame(render);
        }
        render();
        
    }

    function resizer() {
        canvas.width = "1300";
        canvas.height = "800";
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        
        draw();
        
    }
  
  })(window || this);