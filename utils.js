class Utils {
    static hasDuplicates(array) {
      return (new Set(array)).size !== array.length;
    }

    static isShapeClosed(storedLines) {
        if (storedLines.length < 3) {
          return false;
        }
      
        var shapePoints = [];
      
        storedLines.forEach(l => {
          shapePoints.push(... l.getLinePoints());
        }); 
        
        for (var i = 0; i < shapePoints.length; i++) {
          var numbOfDuplicates = 0;
          shapePoints.forEach(p => {
            if (shapePoints[i].isEqual(p)) {
              numbOfDuplicates++;
            }
          });
          if (numbOfDuplicates < 2) {
            return false;
          }
        }
      
        return true;
    }

    static getAreaPoints(storedLines) {
      if (storedLines.length < 3) {
        return;
      }
      var points = [];
      for (let index = 0; index < storedLines.length; index++) {
        const line = storedLines[index];
        if (!points.find(p => p.isEqual(line.startPoint))) {
          points.push(line.startPoint);
        }
        if (!points.find(p => p.isEqual(line.endPoint))) {
          points.push(line.endPoint);
        }
      }
      return points;
    }

    static getEdgePoints(storedLines) {
      let points = this.getAreaPoints(storedLines);
      return {
        minX: Math.min(...points.map(o => o.x)),
        maxX: Math.max(...points.map(o => o.x)),
        minY: Math.min(...points.map(o => o.y)),
        maxY: Math.max(...points.map(o => o.y)),
        minXPoint: points.reduce((min, obj) => (min.x < obj.x) ? min : obj),
        maxXPoint: points.reduce((max, obj) => (max.x > obj.x) ? max : obj),
        minYPoint: points.reduce((min, obj) => (min.y < obj.y) ? min : obj),
        maxYPoint: points.reduce((max, obj) => (max.y > obj.y) ? max : obj),

      }
    }
}
